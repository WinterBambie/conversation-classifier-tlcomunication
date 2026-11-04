from src.predictor import clasificar_mensaje


def main():
    print("=== Clasificador de conversaciones ===")

    mensaje = input("\nEscribe la conversación: ")

    resultado = clasificar_mensaje(mensaje)

    print("\nResultado:")
    print(f"Tema: {resultado['categoria']}")
    print(f"Confianza: {resultado['confianza']:.2%}")

    if resultado["requiere_revision"]:
        print("Requiere revisión humana")
    else:
        print("Predicción aceptada")


if __name__ == "__main__":
    main()