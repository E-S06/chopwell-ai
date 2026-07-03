// WARNING: This is a shared, disposable demo key for the competition judges only.
// Ensure you delete or rotate this key from Google AI Studio after the demo ends.
// Do not use this method (hardcoding keys in the frontend) for production applications.
const ENCODED_KEY = "QVEuQWI4Uk42S0FMb2p2VnBPeWxveVByeWlwVmxqSFZqTTVHWFgtS3lhRHE1emZyb1NDbUE=";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mealForm');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Failsafe in case the key is missing or empty
        if (!DEMO_API_KEY || DEMO_API_KEY.trim() === "") {
            alert('Please insert the disposable API key into app.js before testing.');
            return;
        }

        const budget = document.getElementById('budget').value;
        const condition = document.getElementById('condition').value;
        const foodDataString = JSON.stringify(localFoods);

        loading.classList.remove('hidden');
        resultDiv.classList.add('hidden');

        // Engineered Prompt
        const prompt = `
        You are an expert AI nutrition assistant for Nigerians.
        The user has a daily budget of ₦${budget} and has the following health condition: ${condition}.
        
        Here is the ONLY list of available foods and their estimated prices per portion in Naira:
        ${foodDataString}

        Generate a practical 1-day meal plan (Breakfast, Lunch, Dinner). 
        Rules:
        1. ONLY use the foods from the provided list.
        2. Ensure the total cost is at or below the ₦${budget} budget. Include price estimates next to the meals.
        3. Make sure the food choices are safe and sensible for the specified health condition.
        4. Output the meal plan in clean, plain text formatting. No code blocks, no lecturing.
        `;

        try {
            // Call Gemini 2.5 Flash via REST API using the hardcoded demo key
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${DEMO_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const data = await response.json();
            
            if (data.error) throw new Error(data.error.message);

            const mealPlanText = data.candidates[0].content.parts[0].text;
            resultDiv.textContent = mealPlanText;
            resultDiv.classList.remove('hidden');

        } catch (error) {
            resultDiv.textContent = `Error: ${error.message}`;
            resultDiv.classList.remove('hidden');
        } finally {
            loading.classList.add('hidden');
        }
    });
});
