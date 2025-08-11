import requests
import os
from django.conf import settings

class NutritionAPI:
    def __init__(self):
        self.app_id = os.getenv('EDAMAM_APP_ID')
        self.app_key = os.getenv('EDAMAM_APP_KEY')
        self.base_url = 'https://api.edamam.com/api/nutrition-data'
    
    def get_nutrition_data(self, ingredient, quantity=1, unit='g'):
        params = {
            'app_id': self.app_id,
            'app_key': self.app_key,
            'ingr': f'{quantity}{unit} {ingredient}'
        }
        
        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if 'calories' not in data:
                return None
                
            return {
                'calories': data.get('calories', 0),
                'protein': data.get('totalNutrients', {}).get('PROCNT', {}).get('quantity', 0),
                'carbs': data.get('totalNutrients', {}).get('CHOCDF', {}).get('quantity', 0),
                'fat': data.get('totalNutrients', {}).get('FAT', {}).get('quantity', 0),
            }
        except requests.exceptions.RequestException as e:
            print(f"Error fetching nutrition data: {e}")
            return None