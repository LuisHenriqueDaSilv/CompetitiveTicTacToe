import smtplib 
from email.mime.multipart import MIMEMultipart

class EmailService():

  def __init__(self, email:str, password:str):
      smtp = smtplib.SMTP_SSL("smtp.gmail.com")
      smtp.connect("smtp.gmail.com")
      smtp.login(email, password)
      self.smtp = smtp
      self.address = email

  def send_email(self, msg:MIMEMultipart):
    self.smtp.send_message(msg)