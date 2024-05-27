from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from src.services import EmailService

from src.db.models import UserModel

def send_validation_email(email_service:EmailService, user: UserModel):
  email = MIMEMultipart()
  email["Subject"]= "Seja bem vindo!"
  email["From"]=email_service.address 
  email["To"]=user.email
  content = MIMEText(f"""
                      <div align="center">
                      <h1>Seja bem vindo ao Jogo Da Velha competitivo!</h1></br>
                      <p>Falta pouco para jogar contra outros jogadores!</p>
                      <p>utilize o seguinte código para verificar a sua conta</p></br>
                      <h1>"{user.validation_code}"</h1></br>
                      <p><strong>Te vejo nos rankings!</strong></p>
                      </div>
                      """, "html")
  email.attach(content)
  email_service.send_email(email)

