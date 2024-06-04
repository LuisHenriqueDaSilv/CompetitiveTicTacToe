from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from src.services import EmailService

from src.db.models import UserModel

def change_password_email(email_service: EmailService, user:UserModel, url: str):
  email = MIMEMultipart()
  email["Subject"]= "Redefinição de senha"
  email["From"]=email_service.address 
  email["To"]=user.email
  content = MIMEText(f"""
    <strong>Olá {user.username},</strong></br>
    Recebemos uma solicitação para redefinir a senha da sua conta no nosso site <strong>"Jogo da Velha | Competitivo"</strong>. Se você não fez esta solicitação, por favor, ignore este email. Caso contrário, siga as instruções abaixo para criar uma nova senha.</br>
    </br>
    Para redefinir sua senha, clique no link abaixo:</br>
    <strong><a href="{url}" target="_blank">redefinir senha</a></strong></br>
    Este link é válido por 2 horas. Se você não redefinir sua senha dentro desse período, será necessário solicitar um novo link.</br>
    </br>
    Se você tiver qualquer problema ou dúvida, não hesite em entrar em contato com nossa equipe de suporte através do email <i>{email_service.address }</i>.</br>
    </br>
    Obrigado por jogar com a gente!</br>
    </br>
    <strong>Atenciosamente, Equipe Jogo da Velha | Competitivo</strong>
  """, "html")
  email.attach(content)
  return email
