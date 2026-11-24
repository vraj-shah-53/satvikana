from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Product, Order, OrderItem, UserProfile
from .serializers import ProductSerializer, OrderSerializer, UserSerializer, UserProfileSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

ADMIN_EMAILS = ['vrajjshah53@gmail.com', 'diyajaventures@gmail.com']

def is_admin_user(user):
    if not user or not user.is_authenticated:
        return False
    user_email = (user.email or '').lower().strip()
    user_name = (user.username or '').lower().strip()
    admin_list = [e.lower() for e in ADMIN_EMAILS]
    return user.is_staff or user.is_superuser or user_email in admin_list or user_name in admin_list

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        if is_admin_user(user):
            return Order.objects.all().order_by('-created_at')
        if user and user.is_authenticated:
            return Order.objects.filter(user=user).order_by('-created_at')
        return Order.objects.none()

    def partial_update(self, request, *args, **kwargs):
        if not is_admin_user(request.user):
            return Response({'error': 'Unauthorized. Only Satvikana owners can update order status.'}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if not is_admin_user(request.user):
            return Response({'error': 'Unauthorized. Only Satvikana owners can update order details.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not is_admin_user(request.user):
            return Response({'error': 'Unauthorized. Only Satvikana owners can delete orders.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        # Expecting items in request data
        data = request.data
        items = data.get('items', [])
        total_price = data.get('total_price', 0)
        name = data.get('name', '')
        address = data.get('address', '')
        contact = data.get('contact', '')
        instructions = data.get('instructions', '')
        payment_method = data.get('payment_method', 'UPI')
        payment_status = data.get('payment_status', 'PAID')
        payment_id = data.get('payment_id', '')
        
        order_user = request.user if request.user.is_authenticated else None
        if not order_user:
            try:
                order_user, _ = User.objects.get_or_create(
                    username='guest_customer',
                    defaults={'email': 'guest@satvikana.com', 'first_name': 'Guest Customer'}
                )
            except Exception:
                order_user = None

        order = Order.objects.create(
            user=order_user,
            total_price=total_price,
            status='PENDING',
            name=name,
            address=address,
            contact=contact,
            instructions=instructions,
            payment_method=payment_method,
            payment_status=payment_status,
            payment_id=payment_id
        )
        
        for item in items:
            try:
                product = Product.objects.get(id=item['product_id'])
            except Product.DoesNotExist:
                # Delete the partially created order to avoid orphan records
                order.delete()
                return Response(
                    {'error': f"Product '{item.get('name', 'Unknown')}' is no longer available in our store database. Please empty your cart and add it again."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item['quantity'],
                price=item['price']
            )
        
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

from rest_framework.authtoken.models import Token

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(username=response.data['username'])
        token, created = Token.objects.get_or_create(user=user)
        # Ensure user profile exists
        UserProfile.objects.get_or_create(user=user)
        user_data = UserSerializer(user).data
        user_data['is_admin'] = is_admin_user(user)
        return Response({'token': token.key, 'user': user_data}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        raw_username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        # Try case-insensitive matching for username or email
        target_user = User.objects.filter(username__iexact=raw_username).first() or \
                      User.objects.filter(email__iexact=raw_username).first()
        auth_username = target_user.username if target_user else raw_username

        user = authenticate(username=auth_username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            # Ensure user profile exists
            UserProfile.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data
            user_data['is_admin'] = is_admin_user(user)
            return Response({'token': token.key, 'user': user_data})
        return Response({'error': 'Invalid Credentials. Please verify your email/username and password.'}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({'message': 'Logged out'})

from rest_framework.decorators import api_view, permission_classes

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def seed_db(request):
    from .seed_data import run_seed
    try:
        total = run_seed()
        return Response({'message': f'Database populated successfully! Total products: {total}'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

import time
import re
import json
import urllib.request
import urllib.error
from django.conf import settings

def _cf_call(method, endpoint, payload=None):
    url = f"{settings.CASHFREE_BASE_URL}{endpoint}"
    headers = {
        'x-client-id': settings.CASHFREE_APP_ID,
        'x-client-secret': settings.CASHFREE_SECRET_KEY,
        'x-api-version': settings.CASHFREE_API_VERSION,
        'Content-Type': 'application/json'
    }
    data = json.dumps(payload).encode('utf-8') if payload else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            body = resp.read().decode('utf-8')
            return resp.status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(body)
        except Exception:
            return e.code, {'message': body}
    except Exception as e:
        return 500, {'message': str(e)}


class CashfreeCreateOrderView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        data = request.data
        items = data.get('items', [])
        name = data.get('name', '').strip()
        address = data.get('address', '').strip()
        contact = data.get('contact', '').strip()
        instructions = data.get('instructions', '')

        if not items:
            return Response({'error': 'Your cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)
        if not name or not address or not contact:
            return Response({'error': 'Please provide recipient name, delivery address, and contact number.'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total price securely from database
        total_price = 0
        verified_items = []
        for item in items:
            try:
                prod = Product.objects.get(id=item.get('product_id'))
                qty = int(item.get('quantity', 1))
                price = float(prod.price)
                total_price += price * qty
                verified_items.append({
                    'product_id': prod.id,
                    'name': prod.name,
                    'quantity': qty,
                    'price': price
                })
            except (Product.DoesNotExist, KeyError, ValueError):
                return Response({'error': f"Product '{item.get('name', 'Unknown')}' is unavailable."}, status=status.HTTP_400_BAD_REQUEST)

        if total_price <= 0:
            return Response({'error': 'Invalid order amount.'}, status=status.HTTP_400_BAD_REQUEST)

        # Clean 10-digit phone number
        phone_digits = re.sub(r'\D', '', contact)
        if len(phone_digits) > 10:
            phone_digits = phone_digits[-10:]
        elif len(phone_digits) < 10:
            phone_digits = phone_digits.ljust(10, '0')

        # Generate unique order_id (<= 45 chars, alphanumeric, _ and -)
        user_suffix = str(user.id)[-4:] if user else phone_digits[-4:]
        unique_order_id = f"order_sat_{int(time.time())}_{user_suffix}"

        cust_id = f"cust_{user.id}" if user else f"guest_{phone_digits}"
        cust_email = (user.email or f"{phone_digits}@guest.satvikana.com") if user else f"{phone_digits}@guest.satvikana.com"

        cf_payload = {
            'order_id': unique_order_id,
            'order_amount': round(float(total_price), 2),
            'order_currency': 'INR',
            'customer_details': {
                'customer_id': cust_id[:50],
                'customer_name': name[:90],
                'customer_email': cust_email[:90],
                'customer_phone': phone_digits
            },
            'order_meta': {
                'return_url': f"https://satvikana.com/cart?cf_order_id={unique_order_id}"
            },
            'order_note': 'Satvikana Premium Makhana Order'
        }

        try:
            status_code, cf_data = _cf_call('POST', '/orders', cf_payload)

            if status_code not in (200, 201):
                err_msg = cf_data.get('message', 'Cashfree order generation failed.')
                return Response({'error': err_msg, 'details': cf_data}, status=status.HTTP_400_BAD_REQUEST)

            payment_session_id = cf_data.get('payment_session_id')
            if not payment_session_id:
                return Response({'error': 'Payment session ID could not be generated by Cashfree.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Store the Order directly in database as PENDING (payment_status='UNPAID')
            # So the admin can see every placed order immediately!
            order_user = user
            if not order_user:
                try:
                    order_user, _ = User.objects.get_or_create(
                        username='guest_customer',
                        defaults={'email': 'guest@satvikana.com', 'first_name': 'Guest Customer'}
                    )
                except Exception:
                    order_user = None

            initial_order = Order.objects.create(
                user=order_user,
                total_price=round(float(total_price), 2),
                status='PENDING',
                name=name,
                address=address,
                contact=contact,
                instructions=f"{instructions} [Ref: {unique_order_id}]".strip(),
                payment_method='Cashfree PG (Initiated)',
                payment_status='UNPAID',
                payment_id=unique_order_id
            )

            for item in verified_items:
                try:
                    product_obj = Product.objects.get(id=item['product_id'])
                    OrderItem.objects.create(
                        order=initial_order,
                        product=product_obj,
                        quantity=item['quantity'],
                        price=item['price']
                    )
                except Exception as err:
                    print('Error adding item to initial order:', err)

            return Response({
                'order_id': unique_order_id,
                'db_order_id': initial_order.id,
                'cf_order_id': cf_data.get('cf_order_id'),
                'payment_session_id': payment_session_id,
                'order_amount': round(float(total_price), 2),
                'currency': 'INR',
                'customer_name': name,
                'customer_phone': phone_digits
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f"Failed to connect to Cashfree payment gateway: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CashfreeVerifyPaymentView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        data = request.data
        cf_order_id = data.get('order_id', '').strip()
        shipping = data.get('shipping', {})
        items = data.get('items', [])

        if not cf_order_id:
            return Response({'error': 'Order ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if order already recorded & already marked PAID
        existing_order = Order.objects.filter(payment_id=cf_order_id).first() or                          Order.objects.filter(instructions__contains=cf_order_id).first()
        if existing_order and existing_order.payment_status == 'PAID':
            return Response({
                'success': True,
                'already_recorded': True,
                'order': OrderSerializer(existing_order).data
            })

        try:
            # 1. Fetch order from Cashfree
            status_code, cf_order_data = _cf_call('GET', f'/orders/{cf_order_id}')
            if status_code != 200:
                return Response({'error': 'Unable to verify order with Cashfree.'}, status=status.HTTP_400_BAD_REQUEST)

            order_status = cf_order_data.get('order_status')

            if order_status != 'PAID':
                return Response({
                    'success': False,
                    'order_status': order_status,
                    'error': f"Payment status is '{order_status}'. Order was not paid."
                }, status=status.HTTP_400_BAD_REQUEST)

            # 2. Fetch payments to get transaction id & method
            payment_method_str = 'Cashfree PG'
            tx_id = cf_order_id
            pay_status, payments_list = _cf_call('GET', f'/orders/{cf_order_id}/payments')
            if pay_status == 200 and isinstance(payments_list, list) and len(payments_list) > 0:
                latest_pay = payments_list[-1]
                tx_id = str(latest_pay.get('cf_payment_id') or cf_order_id)
                pay_group = latest_pay.get('payment_group', '').upper()
                if pay_group:
                    payment_method_str = f"Cashfree ({pay_group})"

            # 3. Update existing order or create new order in database
            total_amount = cf_order_data.get('order_amount', 0)
            name = shipping.get('name') or (user.username if user else 'Customer')
            address = shipping.get('address') or ''
            contact = shipping.get('contact') or ''
            instructions = shipping.get('instructions') or ''

            if existing_order:
                existing_order.payment_status = 'PAID'
                existing_order.payment_method = payment_method_str
                existing_order.payment_id = tx_id
                if name: existing_order.name = name
                if address: existing_order.address = address
                if contact: existing_order.contact = contact
                existing_order.save()
                order = existing_order
            else:
                order_user = user
                if not order_user:
                    try:
                        order_user, _ = User.objects.get_or_create(
                            username='guest_customer',
                            defaults={'email': 'guest@satvikana.com', 'first_name': 'Guest Customer'}
                        )
                    except Exception:
                        order_user = None

                order = Order.objects.create(
                    user=order_user,
                    total_price=total_amount,
                    status='PENDING',
                    name=name,
                    address=address,
                    contact=contact,
                    instructions=f"{instructions} [Ref: {cf_order_id}]".strip(),
                    payment_method=payment_method_str,
                    payment_status='PAID',
                    payment_id=tx_id
                )

                # Add items
                for item in items:
                    try:
                        product = Product.objects.get(id=item.get('product_id'))
                        OrderItem.objects.create(
                            order=order,
                            product=product,
                            quantity=item.get('quantity', 1),
                            price=item.get('price', product.price)
                        )
                    except Exception as item_err:
                        print('Error adding item to order:', item_err)

            # Update User profile with address and contact if user is logged in
            if user:
                try:
                    profile, _ = UserProfile.objects.get_or_create(user=user)
                    if name: profile.name = name
                    if address: profile.address = address
                    if contact: profile.contact = contact
                    profile.save()
                except Exception:
                    pass

            return Response({
                'success': True,
                'order': OrderSerializer(order).data,
                'payment_id': tx_id
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f"Error during payment verification: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CashfreeSyncOrderStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if not is_admin_user(request.user):
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        order_id = request.data.get('order_id')
        order = Order.objects.filter(id=order_id).first() or                 Order.objects.filter(payment_id=str(order_id)).first()
        if not order:
            return Response({'error': 'Order not found in database.'}, status=status.HTTP_404_NOT_FOUND)

        cf_order_id = order.payment_id
        if not cf_order_id or not cf_order_id.startswith('order_sat_'):
            # Check instructions for [Ref: order_sat_...]
            match = re.search(r'\[Ref:\s*(order_sat_[^\]]+)\]', order.instructions or '')
            if match:
                cf_order_id = match.group(1).strip()

        if not cf_order_id:
            return Response({'error': 'No Cashfree order reference found for this order.'}, status=status.HTTP_400_BAD_REQUEST)

        # Call Cashfree
        status_code, cf_order_data = _cf_call('GET', f'/orders/{cf_order_id}')
        if status_code != 200:
            return Response({'error': f"Cashfree API returned error {status_code}"}, status=status.HTTP_400_BAD_REQUEST)

        order_status = cf_order_data.get('order_status')
        if order_status == 'PAID':
            order.payment_status = 'PAID'
            pay_status, payments_list = _cf_call('GET', f'/orders/{cf_order_id}/payments')
            if pay_status == 200 and isinstance(payments_list, list) and len(payments_list) > 0:
                latest_pay = payments_list[-1]
                order.payment_id = str(latest_pay.get('cf_payment_id') or cf_order_id)
                pay_group = latest_pay.get('payment_group', '').upper()
                if pay_group:
                    order.payment_method = f"Cashfree ({pay_group})"
            order.save()
            return Response({
                'success': True,
                'message': 'Order successfully verified as PAID with Cashfree.',
                'order': OrderSerializer(order).data
            })
        else:
            return Response({
                'success': False,
                'message': f"Order status in Cashfree is '{order_status}'.",
                'order': OrderSerializer(order).data
            })


class CashfreeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        cf_data = data.get('data', {})
        cf_order = cf_data.get('order', {})
        cf_payment = cf_data.get('payment', {})

        cf_order_id = cf_order.get('order_id') or data.get('orderId') or data.get('order_id')
        payment_status = cf_payment.get('payment_status') or cf_order.get('order_status') or data.get('txStatus')

        if cf_order_id:
            order = Order.objects.filter(payment_id=cf_order_id).first() or                     Order.objects.filter(instructions__contains=cf_order_id).first()
            if order and payment_status in ('SUCCESS', 'PAID'):
                order.payment_status = 'PAID'
                cf_payment_id = cf_payment.get('cf_payment_id') or data.get('referenceId')
                if cf_payment_id:
                    order.payment_id = str(cf_payment_id)
                pay_group = cf_payment.get('payment_group')
                if pay_group:
                    order.payment_method = f"Cashfree ({pay_group.upper()})"
                order.save()
                return Response({'status': 'ok', 'updated': True})

        return Response({'status': 'received'})
