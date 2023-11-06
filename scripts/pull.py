import subprocess
from argparse import ArgumentParser
from pathlib import Path

from huggingface_hub import HfApi, hf_hub_download

parser = ArgumentParser()
parser.add_argument("repo_id", type=str)
parser.add_argument("--quant", type=str, default="Q4_K_M")

args = parser.parse_args()
api = HfApi()

files = api.list_repo_files(args.repo_id)

for file in files:
    if args.quant in file and ".gguf" in file:
        target_path = Path("models") / args.repo_id
        target_path.mkdir(parents=True, exist_ok=True)

        hf_hub_download(args.repo_id, file, local_dir=target_path)
        model_file = target_path / "Modelfile"
        model_file.write_text(f"FROM {file}")

        model_name = Path(file).stem.replace(f".{args.quant}", "")
        subprocess.run(["ollama", "create", model_name, "-f", str(model_file)])
