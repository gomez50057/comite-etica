import pandas as pd
import json

# Cargar datos desde el archivo Excel
file_name = "link_carpetas_Biblioteca_Dig.xlsx"  # Nombre del archivo actualizado
df = pd.read_excel(file_name)

# Crear una lista para almacenar los registros en formato JSON
json_data = []

# Iterar a través de las filas del DataFrame
for index, row in df.iterrows():
    # Dar preferencia a 'link', si está vacío usa 'link_drive'
    link = row["link"] if pd.notnull(row["link"]) else row["link_drive"]
    
    # Crear un diccionario con los nombres originales en el JSON
    record = {
        "name": row["name"],
        "types": [row["category"]],
        "subcategory": row["subcategory"],
        "año": str(row["year"]),
        "descriptionBook": row["description"],
        "pdfSrc": link,
        "booksIndex": str(index + 1)
    }

    # Agregar el diccionario a la lista
    json_data.append(record)

# Convertir la lista de diccionarios a formato JSON
json_output = json.dumps(json_data, ensure_ascii=False, indent=2)

# Guardar el resultado en un archivo JSON
with open("output.json", "w", encoding="utf-8") as json_file:
    json_file.write(json_output)

print("Archivo JSON generado exitosamente.")
