import smtplib 
from email.mime.multipart import MIMEMultipart

class EmailService():

  def __init__(self, email:str, password:str):
    self.smtp = smtplib.SMTP_SSL("smtp.gmail.com")
    self.address = email
    self.password = password

  def send_email(self, msg:MIMEMultipart):
    self.smtp.connect("smtp.gmail.com")
    self.smtp.login(self.address, self.password)
    self.smtp.send_message(msg)
    self.smtp.quit()