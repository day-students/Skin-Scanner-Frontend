from django.http import HttpResponse, JsonResponse  

from tensorflow.keras.models import load_model
from tensorflow import Graph, Session
from PIL import Image
import numpy as np
from io import BytesIO

from tensorflow.keras import backend

graph = Graph()
with graph.as_default():
    session = Session()
    with session.as_default():

        model = load_model('model/model.h5')
        model.compile(loss='categorical_crossentropy',
                    optimizer='RMSProp',
                    metrics=['accuracy'])

def predict(request):
    global model

    try:

        image = Image.open(BytesIO(request.body))
        image = image.resize((224, 224))
        image = np.array(image)[:, :, :3]
        image = image.reshape(1, *image.shape) / 255
        
        backend.set_session(session)

        with graph.as_default():    
            preds = model.predict(image)[0]
        preds *= 100
        preds = [float(pred) for pred in preds]

        diseases = ['Eczema', 'Psoriasis', 'Tinea', 'No disease']

        labeled_predictions = dict(sorted(
            zip(diseases, preds),
            reverse=True,
            key=lambda pair: pair[1]
        ))
        
        return JsonResponse(labeled_predictions)
    except:
        return HttpResponse(status=500)