from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from src.services import EmailService
from src.db.models import UserModel

def user_validation_email(email_service:EmailService, user: UserModel):
  email = MIMEMultipart()
  email["Subject"]= "Bem-vindo ao Jogo da Velha | Competitivo! - Valide sua Conta"
  email["From"]=email_service.address 
  email["To"]=user.email
  content = MIMEText(f"""
    <strong>Olá {user.username},</strong></br>                     

    Estamos entusiasmados em recebê-lo no <strong>"Jogo da Velha | Competitivo"!</strong> Para completar seu registro e começar a jogar, precisamos que você valide sua conta.</br>
    </br>
    Seu código de validação é:</br>
    <div align="center">
      <h2>{user.validation_code}</h2>
      <a href="https://google.com" target="_blank">clique aqui para acessar a página de validação</a>
    </div></br>
    </br>
    Se você tiver qualquer problema ou dúvida, não hesite em entrar em contato com nossa equipe de suporte através do email <strong>{email_service.address}</strong>.</br>
    </br>
    Obrigado por se registrar e esperamos que você aproveite seu tempo jogando com a gente!</br>
    </br>
    <strong>Atenciosamente, Equipe Jogo da Velha | Competitivo</strong>
  """, "html")
  email.attach(content)
  return email