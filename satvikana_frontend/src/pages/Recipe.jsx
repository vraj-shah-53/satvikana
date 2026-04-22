import React, { useState } from 'react';
import { Clock, ChefHat, Info } from 'lucide-react';

const Recipe = () => {
  const [expandedId, setExpandedId] = useState(null);

  const recipes = [
    {
      id: 1,
      title: 'Spicy Masala Roasted Makhana',
      time: '15 mins',
      difficulty: 'Easy',
      desc: 'The classic, healthy anytime snack heavily coated with Indian spices.',
      ingredients: [
        '2 cups Satvikana Makhana',
        '1 tbsp Ghee or Olive Oil',
        '1/2 tsp Turmeric Powder',
        '1/2 tsp Red Chilli Powder',
        '1 tsp Chaat Masala',
        'Salt to taste'
      ],
      instructions: [
        'Heat ghee in a thick-bottomed pan over low heat.',
        'Add the turmeric and red chilli powder. Quickly stir for 10 seconds to release the aroma.',
        'Add the Makhana and roast on low heat for 10-12 minutes until crunchy.',
        'Turn off the heat, sprinkle chaat masala and salt. Toss well.',
        'Let it cool completely and store in an airtight container.'
      ],
      img: '/best_image.png'
    },
    {
      id: 2,
      title: 'Creamy Makhana Kheer',
      time: '40 mins',
      difficulty: 'Medium',
      desc: 'A rich, traditional Indian dessert made using fox nuts, milk, and saffron.',
      ingredients: [
        '1 cup Satvikana Makhana',
        '1 liter Whole Milk',
        '1/2 cup Sugar',
        'A pinch of Saffron',
        '1/2 tsp Cardamom Powder',
        '2 tbsp Mixed Nuts (Almonds, Cashews)'
      ],
      instructions: [
        'Crush half of the makhana roughly and leave the rest whole.',
        'Dry roast the nuts and the makhana for 5 minutes until crispy.',
        'In a heavy pan, bring milk to a boil and let it simmer for 15 minutes to reduce slightly.',
        'Add the roasted makhana, saffron, and sugar to the milk.',
        'Cook on low heat for another 20 minutes until the kheer thickens.',
        'Garnish with cardamom powder and serve warm or chilled!'
      ],
      img: '/best_image.png'
    },
    {
      id: 3,
      title: 'Makhana Bhel Pizza',
      time: '10 mins',
      difficulty: 'Quick',
      desc: 'A modern, tangy fusion twist on pizza using crunchy makhana as a base salad.',
      ingredients: [
        '2 cups Roasted Satvikana Makhana',
        '1 finely chopped Onion',
        '1 finely chopped Tomato',
        '2 tbsp Green Chutney',
        '1 tbsp Tamarind (Meethi) Chutney',
        'Sev and Coriander to garnish'
      ],
      instructions: [
        'In a large mixing bowl, combine the roasted crisp makhana with chopped tomatoes and onions.',
        'Drizzle the green chutney and tamarind chutney evenly over the mixture.',
        'Toss thoroughly so every makhana gets coated with tangy flavors.',
        'Quickly garnish with crunchy sev and fresh coriander leaves.',
        'Serve immediately so the makhana retains its signature crunch!'
      ],
      img: '/best_image.png'
    }
  ];

  return (
    <div className="page-container" style={{ background: 'var(--bg-color)' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>Cook with <span>Satvikana</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '15px auto 0' }}>
          Discover beautiful, healthy, and incredibly easy ways to integrate our premium Fox Nuts into your daily meals and desserts.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '900px', margin: '0 auto' }}>
        {recipes.map(recipe => (
          <div key={recipe.id} style={{ 
            background: 'var(--surface-color)', 
            borderRadius: '20px', 
            overflow: 'hidden', 
            boxShadow: 'var(--shadow-custom)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              
              {/* Recipe Image Slot */}
              <div style={{ flex: '1', minWidth: '300px', height: '250px' }}>
                <img src={recipe.img} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Recipe Intro Strip */}
              <div style={{ flex: '1.5', minWidth: '300px', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>{recipe.title}</h2>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><Clock size={16} /> {recipe.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}><ChefHat size={16} /> {recipe.difficulty}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '25px', lineHeight: '1.6' }}>{recipe.desc}</p>
                <button 
                  onClick={() => setExpandedId(expandedId === recipe.id ? null : recipe.id)}
                  style={{ 
                    alignSelf: 'flex-start',
                    background: expandedId === recipe.id ? 'var(--secondary-color)' : 'var(--accent-color)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '12px 30px', 
                    borderRadius: '30px', 
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'var(--transition)'
                  }}>
                  {expandedId === recipe.id ? 'Hide Recipe' : 'View Full Recipe'}
                </button>
              </div>
            </div>

            {/* Accordion Expansion containing Instructions */}
            <div style={{ 
              maxHeight: expandedId === recipe.id ? '1000px' : '0', 
              transition: 'max-height 0.6s ease-in-out', 
              overflow: 'hidden',
              background: '#FAFAFA'
            }}>
              <div style={{ padding: '30px', display: 'flex', flexWrap: 'wrap', gap: '40px', borderTop: '1px solid var(--border-color)' }}>
                {/* Ingredients List */}
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Info size={24} /> Ingredients
                  </h3>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: 'var(--text-primary)', lineHeight: '2' }}>
                    {recipe.ingredients.map((item, idx) => <li key={idx}>{item}</li>)}
                  </ul>
                </div>
                
                {/* Instructions List */}
                <div style={{ flex: '2', minWidth: '300px' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--primary-color)' }}>Step-by-step Instructions</h3>
                  <ol style={{ paddingLeft: '20px', color: 'var(--text-primary)', lineHeight: '2' }}>
                    {recipe.instructions.map((step, idx) => (
                      <li key={idx} style={{ marginBottom: '10px' }}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div> 

          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipe;
