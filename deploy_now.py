import subprocess
import datetime
import sys

cli_python = r"C:\Users\guyoh\AppData\Local\AzureCLI\Microsoft SDKs\Azure\CLI2\python.exe"

# 1. Get storage account key
res = subprocess.run(
    [cli_python, "-IBm", "azure.cli", "storage", "account", "keys", "list", "--account-name", "guyohalakeportfolio", "--resource-group", "rg-portfolio-san", "--query", "[0].value", "-o", "tsv"],
    capture_output=True, text=True, shell=False
)
account_key = res.stdout.strip()

# 2. Upload deploy.zip to blob storage
print("Uploading updated deploy.zip to blob storage...")
subprocess.run(
    [cli_python, "-IBm", "azure.cli", "storage", "blob", "upload", "--account-name", "guyohalakeportfolio", "--account-key", account_key, "-c", "deploy-packages", "-n", "deploy.zip", "-f", r"C:\Users\guyoh\Desktop\MyPorfolio\Gazi-V2\deploy.zip", "--overwrite"],
    capture_output=True, text=True, shell=False
)

# 3. Generate SAS token
expiry = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=3)).strftime("%Y-%m-%dT%H:%M:%SZ")
res_sas = subprocess.run(
    [cli_python, "-IBm", "azure.cli", "storage", "blob", "generate-sas", "--account-name", "guyohalakeportfolio", "--account-key", account_key, "-c", "deploy-packages", "-n", "deploy.zip", "--permissions", "r", "--expiry", expiry, "-o", "tsv"],
    capture_output=True, text=True, shell=False
)
sas = res_sas.stdout.strip()
blob_url = f"https://guyohalakeportfolio.blob.core.windows.net/deploy-packages/deploy.zip?{sas}"

# 4. Deploy to guyohalake webapp
print("Deploying package to guyohalake.azurewebsites.net...")
cmd = [
    cli_python, "-IBm", "azure.cli", "webapp", "deploy",
    "--resource-group", "rg-nyagah-fee",
    "--name", "guyohalake",
    "--type", "zip",
    "--src-url", blob_url
]
deploy_res = subprocess.run(cmd, capture_output=True, text=True, shell=False)
print("Deploy status:", deploy_res.returncode)
print("Deploy output:\n", deploy_res.stdout)

