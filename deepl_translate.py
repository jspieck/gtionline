import requests
import json


api_key = "f2968829-68a5-e957-fa8a-155f841c8fac:fx"

# Set the target language and the text to be translated
target_lang = "uk"

with open("src/locales/de.json", "r") as fp:
  original_language_file = json.load(fp)

translated_file = {}
for key, text in original_language_file.items():
  # Send the request to the DeepL API
  try: 
    response = requests.post("https://api-free.deepl.com/v2/translate",
                            data={
                                "auth_key": api_key,
                                "target_lang": target_lang,
                                "text": text,
                                "tag_handling": 'xml'
                            })
    response_json = response.json()
    translated_file[key] = response_json['translations'][0]['text']
  except:
    translated_file[key] = ""

with open(f"{target_lang}.json", "w", encoding="utf-8") as fp:
  json.dump(translated_file, fp, ensure_ascii=False)