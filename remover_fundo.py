#!/usr/bin/env python3
"""
Script to remove background from images and save as PNG.
Requires: pip install pillow opencv-python
"""

import os
import sys
from pathlib import Path
from PIL import Image
import tkinter as tk
from tkinter import filedialog, messagebox
import cv2
import numpy as np


def remove_background_cv2(input_path: str) -> np.ndarray:
    """
    Remove white background from image and make it transparent.
    
    Args:
        input_path: Path to the input image file
    
    Returns:
        Image with transparent background (RGBA)
    """
    # Read image
    image = cv2.imread(input_path, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"Could not read image: {input_path}")
    
    # Convert BGR to BGR with alpha channel
    image_bgra = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    
    # Convert to HSV for better white detection
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    # Define range for white color (low saturation, high value)
    lower_white = np.array([0, 0, 200])
    upper_white = np.array([180, 25, 255])
    
    # Create mask for white pixels
    mask_white = cv2.inRange(hsv, lower_white, upper_white)
    
    # Invert to get non-white areas (foreground)
    mask_foreground = cv2.bitwise_not(mask_white)
    
    # Apply slight blur for smoother transitions
    mask_foreground = cv2.GaussianBlur(mask_foreground, (3, 3), 0)
    
    # Set alpha channel - white becomes transparent, rest becomes opaque
    image_bgra[:, :, 3] = mask_foreground
    
    return image_bgra


def remove_background(input_path: str, output_path: str | None = None) -> None:
    """
    Remove background from an image and save as PNG.
    
    Args:
        input_path: Path to the input image file
        output_path: Path to save the output PNG (optional)
                    If not provided, saves in the same directory with '_no_bg' suffix
    """
    try:
        # Validate input file
        input_file = Path(input_path)
        if not input_file.exists():
            print(f"Error: Input file not found: {input_path}")
            return
        
        if not input_file.is_file():
            print(f"Error: Input path is not a file: {input_path}")
            return
        
        # Determine output path
        if output_path is None:
            output_file = input_file.parent / f"{input_file.stem}_no_bg.png"
        else:
            output_file = Path(output_path)
        
        print(f"Processing: {input_file}")
        print(f"Output: {output_file}")
        
        # Remove background
        print("Removing background...")
        result = remove_background_cv2(str(input_file))
        
        # Convert BGR to RGB and save as PNG
        result_rgb = cv2.cvtColor(result, cv2.COLOR_BGRA2RGBA)
        pil_image = Image.fromarray(result_rgb)
        pil_image.save(output_file, "PNG")
        
        print(f"Success! Image saved to: {output_file}")
        
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        sys.exit(1)


def batch_remove_background(input_directory: str, output_directory: str | None = None) -> None:
    """
    Remove background from all images in a directory.
    
    Args:
        input_directory: Directory containing image files
        output_directory: Directory to save processed images (optional)
                         If not provided, saves in the same directory
    """
    try:
        input_dir = Path(input_directory)
        if not input_dir.exists():
            print(f"Error: Directory not found: {input_directory}")
            return
        
        if output_directory is None:
            output_dir = input_dir
        else:
            output_dir = Path(output_directory)
            output_dir.mkdir(parents=True, exist_ok=True)
        
        # Supported image extensions
        image_extensions = {".jpg", ".jpeg", ".png", ".bmp", ".gif", ".webp"}
        
        # Find all image files
        image_files = [
            f for f in input_dir.iterdir()
            if f.is_file() and f.suffix.lower() in image_extensions
        ]
        
        if not image_files:
            print(f"No image files found in: {input_directory}")
            return
        
        print(f"Found {len(image_files)} image(s) to process")
        
        for idx, image_file in enumerate(image_files, 1):
            output_file = output_dir / f"{image_file.stem}_no_bg.png"
            print(f"\n[{idx}/{len(image_files)}] Processing: {image_file.name}")
            remove_background(str(image_file), str(output_file))
    
    except Exception as e:
        print(f"Error processing directory: {str(e)}")
        sys.exit(1)


def open_file_dialog() -> None:
    """Open file dialog to select an image and remove its background."""
    root = tk.Tk()
    root.withdraw()  # Hide the main window
    
    # Open file dialog
    file_path = filedialog.askopenfilename(
        title="Selecione uma imagem",
        filetypes=[
            ("Todas as imagens", "*.jpg *.jpeg *.png *.bmp *.gif *.webp"),
            ("JPG", "*.jpg *.jpeg"),
            ("PNG", "*.png"),
            ("BMP", "*.bmp"),
            ("GIF", "*.gif"),
            ("WebP", "*.webp"),
            ("Todos os arquivos", "*.*")
        ]
    )
    
    if not file_path:
        messagebox.showinfo("Cancelado", "Nenhuma imagem foi selecionada.")
        root.destroy()
        return
    
    # Ask for output location
    output_path = filedialog.asksaveasfilename(
        title="Salve a imagem sem fundo",
        defaultextension=".png",
        initialfile=f"{Path(file_path).stem}_no_bg.png",
        filetypes=[("PNG", "*.png"), ("Todos os arquivos", "*.*")]
    )
    
    if not output_path:
        messagebox.showinfo("Cancelado", "Operação cancelada.")
        root.destroy()
        return
    
    try:
        print(f"Processando: {file_path}")
        print(f"Salvando em: {output_path}")
        
        print("Removendo fundo...")
        result = remove_background_cv2(file_path)
        
        # Convert BGR to RGB and save as PNG
        result_rgb = cv2.cvtColor(result, cv2.COLOR_BGRA2RGBA)
        pil_image = Image.fromarray(result_rgb)
        pil_image.save(output_path, "PNG")
        
        messagebox.showinfo("Sucesso!", f"Imagem salva com sucesso!\n\n{output_path}")
        print(f"Sucesso! Imagem salva em: {output_path}")
        
    except Exception as e:
        messagebox.showerror("Erro", f"Erro ao processar a imagem:\n{str(e)}")
        print(f"Erro: {str(e)}")
    
    root.destroy()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        # No arguments - open GUI
        open_file_dialog()
    elif sys.argv[1] == "--batch":
        # Batch mode
        if len(sys.argv) < 3:
            print("Error: --batch requires input directory")
            sys.exit(1)
        
        input_dir = sys.argv[2]
        output_dir = sys.argv[3] if len(sys.argv) > 3 else None
        batch_remove_background(input_dir, output_dir)
    else:
        # Single file mode (command line)
        input_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else None
        remove_background(input_file, output_file)
