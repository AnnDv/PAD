FROM python:3.9-slim-buster

RUN mkdir /app

COPY . /app

WORKDIR /app



RUN pip3 install --no-cache-dir --upgrade pip && \
    pip3 install --no-cache-dir flask flask-migrate Flask-SQLAlchemy PyJWT marshmallow bcrypt psycopg2-binary



ENV FLASK_APP=app.py

# CMD ["flask", "run", "--host", "0.0.0.0", "--port", "8887"]
# CMD ["flask", "run", "--host=0.0.0.0", "--port=8887"]

# CMD flask run --host=0.0.0.0 
CMD ["flask", "run", "--host=0.0.0.0"]