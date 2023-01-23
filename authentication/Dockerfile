FROM python:latest

ADD . /app
WORKDIR /app

# ADD requirements.txt requirements.txt

RUN pip install -r requirements.txt

# COPY app.py app.py
ENV FLASK_APP=main.py
CMD ["python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=8887"]