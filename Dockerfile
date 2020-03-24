FROM golang

RUN mkdir $HOME/src && \
    cd $HOME/src && \
    git clone https://github.com/gohugoio/hugo.git && \
    cd hugo && \
    go install

RUN mkdir /app

WORKDIR /app

COPY . /app

CMD ["hugo", "server", "--bind=0.0.0.0"]
