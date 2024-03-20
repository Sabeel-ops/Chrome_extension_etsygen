
import json
import textwrap
import google.generativeai as genai
import PIL.Image
import base64
import io
from django.shortcuts import render
from django.http import JsonResponse

# for Forbidden(CSRF cookie not set)
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

def do_something(json_array):
    return_data_array = []
    
    # open received json

    first_element = json_array[0]
    target_url = first_element['url']   
    google_api_key = 'AIzaSyCoLQnJWSk6zPOsdZ0Hq0jNC6deWR7x8BE'
    genai.configure(api_key=google_api_key)
    user_prompt = 'Generate etsy titles and tags for this image'
    if target_url.startswith('data:image/'):
        _, base64_data = target_url.split(',', 1)
        decoded_image = PIL.Image.open(io.BytesIO(base64.b64decode(base64_data)))
    else:    
        decoded_image = PIL.Image.open(io.BytesIO(base64.b64decode(target_url)))
    model = genai.GenerativeModel('gemini-pro-vision')
    response = model.generate_content(["Generate seo optimized etsy titles and tags for this product", decoded_image], stream=True)
    response.resolve()
    print(response.text)
    titles=response.text
    data = {}
    data['status'] = titles
    return_data_array.append(data)
    return return_data_array
    

@method_decorator(csrf_exempt, name='dispatch')
def get_analyzed_info(request):
    print('Request received from client')
    if request.method == 'POST':
        json_array = json.loads(request.body)

        # do something
        result = do_something(json_array)

        # send data to client 
        return JsonResponse(result, safe=False)
    else:
        return JsonResponse({'message': 'Server received GET request.', 'status': 'GET'})