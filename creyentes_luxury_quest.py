import pygame
import sys

pygame.init()

# Dimensiones de la ventana
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Creyentes: The Luxury Quest")

# Definir colores (RGB)
BG_COLOR = (2, 2, 2)            # Fondo: #020202
TEXT_COLOR = (217, 223, 226)      # Texto: #d9dfe2
BUTTON_COLOR = (101, 211, 168)    # Botón: #65d3a8
LABYRINTH_COLOR = (61, 159, 227)  # Laberinto: #3d9fe3

# Estados del juego: "start" para la pantalla inicial, "game" para el laberinto
state = "start"

# Fuentes (usamos Arial como ejemplo; si cuentas con TT Norms, puedes cargarla con pygame.font.Font)
title_font = pygame.font.SysFont("Arial", 40)
button_font = pygame.font.SysFont("Arial", 30)

# Cargar el logo de la marca (asegúrate de tener el archivo "logo.png" en el directorio del proyecto)
try:
    logo = pygame.image.load("logo.png")
    logo = pygame.transform.scale(logo, (200, 200))  # Ajusta el tamaño según necesites
except Exception as e:
    print("No se pudo cargar el logo:", e)
    logo = None

# Definir el rectángulo del botón en la pantalla de inicio
button_rect = pygame.Rect(WIDTH // 2 - 100, 450, 200, 50)

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        # Detectar clic en el botón de "Iniciar la misión" en la pantalla de inicio
        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if state == "start" and button_rect.collidepoint(event.pos):
                state = "game"
    
    # Limpiar la pantalla
    screen.fill(BG_COLOR)
    
    if state == "start":
        # Dibujar el logo, si está disponible
        if logo is not None:
            logo_rect = logo.get_rect(center=(WIDTH // 2, 150))
            screen.blit(logo, logo_rect)
        # Dibujar el título en la pantalla de inicio
        title_text = title_font.render("Creyentes: The Luxury Quest", True, TEXT_COLOR)
        title_rect = title_text.get_rect(center=(WIDTH // 2, 300))
        screen.blit(title_text, title_rect)
        
        # Dibujar el botón
        pygame.draw.rect(screen, BUTTON_COLOR, button_rect, border_radius=5)
        button_text = button_font.render("Iniciar la misión", True, BG_COLOR)
        button_text_rect = button_text.get_rect(center=button_rect.center)
        screen.blit(button_text, button_text_rect)
    
    elif state == "game":
        # Dibujar un laberinto básico (un rectángulo que representa el entorno de lujo)
        labyrinth_rect = pygame.Rect(50, 50, 700, 500)
        pygame.draw.rect(screen, LABYRINTH_COLOR, labyrinth_rect)
        
        # Mostrar un mensaje en la parte superior del laberinto
        game_text = button_font.render("Laberinto de lujo", True, TEXT_COLOR)
        game_text_rect = game_text.get_rect(center=(WIDTH // 2, 30))
        screen.blit(game_text, game_text_rect)
    
    # Actualizar la pantalla
    pygame.display.flip()

pygame.quit()
sys.exit()

