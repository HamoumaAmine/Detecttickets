import requests
import json
import os
from datetime import datetime
import re
import time
from tqdm import tqdm

url_upload = "https://api.veryfi.com/api/v8/partner/documents/"
api_key = "oue93klhrJfR41W4vHGCtMP7g2v3WYQj"  # Clé API Mistral

def categorize_items(items: list, api_key: str) -> list:
    url = "https://api.mistral.ai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Bearer {api_key}",
    }

    if not isinstance(items, list):
        print("❌ Mauvais format reçu dans items:", type(items))
        return []

    for item in tqdm(items, desc="🔄 Catégorisation"):
        if not isinstance(item, dict):
            print("❌ Élément invalide dans items:", item)
            continue

        item_name = item.get("description")
        if not item_name:
            item["category"] = "Unknown"
            continue

        prompt = f"""
            Catégorisez cet article en UNE SEULE catégorie parmi :
            Alimentation, Shopping, Santé, Restaurant, Transport, Loisirs, Unknown.

            Article : {item_name}

            Réponds uniquement avec le nom exact d'UNE SEULE catégorie.
        """

        payload = {
            "model": "mistral-medium",
            "messages": [{"role": "user", "content": prompt.strip()}],
            "temperature": 0.3,
            "max_tokens": 100,
        }

        try:
            response = requests.post(url, headers=headers, json=payload, timeout=10)
            if response.status_code == 200:
                result = response.json()
                category = result["choices"][0]["message"]["content"].strip().split()[0]
                item["category"] = category
            else:
                print(f"⚠️ Erreur API ({response.status_code}) : {response.text}")
                item["category"] = "Unknown"
                time.sleep(2)
        except Exception as e:
            print(f"❌ Exception API : {e}")
            item["category"] = "Unknown"
            time.sleep(2)

    return items

def process_image(image_file_path):
    with open(image_file_path, 'rb') as f:
        files = {'file': (image_file_path, f, 'image/jpeg')}
        headers = {
            'Accept': 'application/json',
            'CLIENT-ID': 'vrflNowDc90Cj8BexNj89VG72HW6tgYydxCuesB',
            'AUTHORIZATION': 'apikey hamouma.amine:4b442b4debe4103aeebd60db67b388c5'
        }

        response = requests.post(url_upload, headers=headers, files=files)
        document = response.json()
        if "id" not in document:
            raise ValueError(f"✅ Upload réussi, mais pas d'ID retourné : {document}")

        document_id = document["id"]
        url_get = f"https://api.veryfi.com/api/v8/partner/documents/{document_id}"
        response_get = requests.get(url_get, headers=headers)
        receipt_data = response_get.json()

        ocr_text = receipt_data.get('ocr_text', '')
        datetime_match = re.search(r"(\d{2}/\d{2}/\d{4} \d{2}:\d{2}:\d{2})", ocr_text)
        ticket_datetime = datetime.strptime(datetime_match.group(1), "%d/%m/%Y %H:%M:%S") if datetime_match else datetime.now()

        try:
            tax_rate = receipt_data.get('tax_lines', [{}])[0].get('rate', 'N/A')
        except (IndexError, KeyError, TypeError):
            tax_rate = 'N/A'

        # Construction améliorée des items avec fusion si besoin
        merged_items = []
        current_item = None
        for item in receipt_data.get('line_items', []):
            if current_item and not item.get("description"):
                current_item["quantity"] += item.get("quantity", 1)
                current_item["price"] = item.get("price", current_item["price"])
                current_item["total"] = item.get("total", current_item["total"])
            else:
                if current_item:
                    merged_items.append(current_item)
                current_item = {
                    'description': item.get('description', 'N/A'),
                    'full_description': item.get('full_description', 'N/A'),
                    'quantity': item.get('quantity', 1),
                    'price': item.get('price', 'N/A'),
                    'total': item.get('total', 'N/A')
                }
        if current_item:
            merged_items.append(current_item)

        categorized_items = categorize_items(merged_items, api_key)

        relevant_data = {
            'id': receipt_data.get('id', 'N/A'),
            'store_name': receipt_data.get('vendor', {}).get('name', 'N/A'),
            'store_email': receipt_data.get('vendor', {}).get('email', 'N/A'),
            'store_address': receipt_data.get('vendor', {}).get('address', 'N/A'),
            'total_amount': receipt_data.get('total', 'N/A'),
            'subtotal': receipt_data.get('subtotal', 'N/A'),
            'tax_amount': receipt_data.get('tax', 'N/A'),
            'tax_rate': tax_rate,
            'currency': receipt_data.get('currency_code', 'N/A'),
            'payment_type': receipt_data.get('payment', {}).get('type', 'N/A'),
            'ticket_number': receipt_data.get('invoice_number', 'N/A'),
            'date_time': ticket_datetime.strftime("%d-%m-%Y %H:%M:%S"),
            'document_type': receipt_data.get('document_type', 'N/A'),
            'document_title': receipt_data.get('document_title', 'N/A'),
            'category': receipt_data.get('category', 'N/A'),
            'country_code': receipt_data.get('country_code', 'N/A'),
            'duplicate_of': receipt_data.get('duplicate_of', 'N/A'),
            'items': categorized_items,
            'image_url': receipt_data.get('img_url', 'N/A'),
            'thumbnail_url': receipt_data.get('img_thumbnail_url', 'N/A'),
            'pdf_url': receipt_data.get('pdf_url', 'N/A')
        }

        return relevant_data
