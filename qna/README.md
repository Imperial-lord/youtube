# Deploy a ML Model with Fast API and AWS EC2

In this video, let's have a look at how you can deploy your ML models using Fast API on AWS EC2 instance.
Deploying your ML models or integrating them with your web application, is a quite important task.
FastAPI with it's speed, ease of use, built-in support and documentation is an ideal candiadate for this task.

## 🛠 What we are gonna learn to use

![Image](https://i.ibb.co/74Pbpcq/Blue-Red-White-and-Yellow-Philippine-Flag-on-Concrete-Wall-Philippine-Independence-Day-Linked-In-Ban.png)

## 🤔 Choosing a ML model

Usually you might wanna deploy your own models, or the ones you have trained and tuned to a specific use case or dataset.
For this demo, however, we are going to use a pretained model.

One of the best sources for finding pretrained models is [Hugging Face](https://huggingface.co). We will choose the [roberta-base model](https://huggingface.co/roberta-base), fine-tuned using the [SQuAD2.0](https://huggingface.co/datasets/squad_v2) dataset. It's been trained on question-answer pairs, including unanswerable questions, for the task of Question Answering.

## 🧑🏻‍💻 Building a Fast API application

For this process, you need to follow along with the video.
However, just make sure of these 2 things -

1. Make sure you have Python v3.6+ and pip installed to your system and added to the path.
2. You should have PyTorch installed inside the virtual environment. For this you can use the command (MacOS, Windows) below.
   If you want to customise the install, checkout [Getting started with PyTorch locally](https://pytorch.org/get-started/locally/).

   ```bash
   pip3 install torch
   ```

## 🌩 Deploy on AWS EC2

We will make use of Nginx. Nginx is an open-source Web Server written in C that was designed with the purpose of being the world’s fastest Web Server.
It was created in 2004 by Igor Sysoev. One of the major advantages that it will offer is the ability to easily add an SSL certificate.

You can create a self-signed ssl certificate inside `/etc/nginx/ssl` using the following command:

```
sudo openssl req -batch -x509 -nodes -days 365 \
-newkey rsa:2048 \
-keyout /etc/nginx/ssl/server.key \
-out /etc/nginx/ssl/server.crt
```

After creating the EC2 instance (Ubuntu OS) and installing nginx, you need to add the following inside `/etc/nignx/sites-enabled` in a file which we can call `fastapi_nginx`.

```
server {
        listen 80;
        listen 443 ssl;
        ssl on;
        ssl_certificate /etc/nginx/ssl/server.crt;
        ssl_certificate_key /etc/nginx/ssl/server.key;
        server_name xx.xxx.xxx.xx;
        location / {
                 proxy_pass http://127.0.0.1:8000;
        }
}
```

Here xx.xxx.xxx.xx needs to be replaced with your instance's public IP address.

Now, if we run our app using uvicorn, we can see the app running at the public IP and interact with it.
However, this is not all we need to do. We need to ensure that uvicorn keeps running even though we are not connected via SSH.
Moreover, it’d be a bonus if we could run a bash script to activate the server every time the EC2 instance restarts. Let’s do these now.

Inside `/etc/systemd/system` we create a new service (say) - `qna.service`

```
[Unit]
Description=Uvicorn instance to serve QnA-RoBERTa-FastAPI
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/qna
Environment="PATH=/home/ubuntu/qna/venv/bin"
ExecStart=/home/ubuntu/qna/venv/bin/uvicorn main:app

[Install]
WantedBy=multi-user.target
```

After saving this file - run the command from your home directory.

```
sudo systemctl start nginx && cd /etc/systemd/system && sudo systemctl start qna.service
```

Finally, you can set a crontab to handle accidental EC2 instance reboot (so that you don't have to run the last command, over and over again!).
For that create a bash script - script.sh in your home directory. Make sure to allow execute permissions using sudo chmod+x script.sh.

```
#!/bin/bash
sudo systemctl start nginx
cd /etc/systemd/system
sudo systemctl start qna.service
```

Now run crontab -e, and at the end of the file, add the line —

```
@reboot /home/ubuntu/script.sh
```

Save this, reboot your instance and see the magic happen 🙂🪄

## ✍️ Medium blog

Find a related medium blog here - [If your startup involves social media, make sure of this …](https://medium.com/nerd-for-tech/if-your-startup-involves-social-media-make-sure-of-this-5c415ce90c20).
<br>Make sure to [follow](https://medium.com/@absatyaprakash) me on Medium and add yourself to my [mailing list](https://absatyaprakash.medium.com/subscribe) to stay updated about my blogs regularly! 🥳

## 🤝 Support me

You can support me by liking, sharing the video and [subscribing](https://www.youtube.com/c/ABSatyaprakash?sub_confirmation=1) to my Youtube channel, as well as by starring this repository if you love the work ❤️

## 😞 I have an issue ...

Make sure to watch the video, and that might just clarify your issue, because I have demonstrated all the steps there.
Still, if you have anything, just open an issue or comment on the youtube video, or reach out to me and I'll love to help!

Thank you for visiting!
