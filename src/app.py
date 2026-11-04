from src.predictor import clasificar_mensaje


def main():
    print("=== Clasificador de conversaciones ===")

    mensaje = input("\nEscribe la conversación: ")

    categoria, confianza = clasificar_mensaje(mensaje)

    print("\nResultado:")
    print(f"Tema: {categoria}")
    print(f"Confianza: {confianza:.2%}")

    if confianza < 0.20:
        print("Requiere revisión humana")
    else:
        print("Predicción aceptada")


if __name__ == "__main__":
    main()