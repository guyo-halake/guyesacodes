"""
Automated Azure Deployment Script for Biftu (biftu.azurewebsites.net)
Deploys hashlist-site to Azure App Service in resource group rg-nyagah-fee.
"""
import os
import zipfile
import subprocess
import sys

SITE_DIR = os.path.abspath("hashlist-site")
ZIP_NAME = "biftu_deploy.zip"
APP_NAME = "biftu"
RESOURCE_GROUP = "rg-nyagah-fee"

def make_zip():
    print(f"[1/3] Packaging {SITE_DIR} into {ZIP_NAME}...")
    with zipfile.ZipFile(ZIP_NAME, "w", zipfile.ZIP_DEFLATED) as z:
        for root, dirs, files in os.walk(SITE_DIR):
            for file in files:
                if file == ZIP_NAME or file.endswith(".tmp"):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, SITE_DIR)
                z.write(full_path, rel_path)
    print(f"Archive created ({os.path.getsize(ZIP_NAME) / 1024 / 1024:.2f} MB).")

def deploy():
    make_zip()
    print(f"[2/3] Checking Azure CLI login status...")
    az_cmd = "az"
    # Fallback to local Azure CLI path if not on system PATH
    cli_fallback = r"C:\Users\guyoh\AppData\Local\AzureCLI\bin\az.cmd"
    if os.path.exists(cli_fallback):
        az_cmd = cli_fallback

    # Test az login status
    res = subprocess.run([az_cmd, "account", "show"], capture_output=True, text=True)
    if res.returncode != 0:
        print("ERROR: Azure CLI not logged in. Please run 'az login' first.")
        return

    print(f"[3/3] Deploying to Azure App Service: {APP_NAME} in resource group: {RESOURCE_GROUP}...")
    # Check if app exists or create it
    check_app = subprocess.run([az_cmd, "webapp", "show", "--name", APP_NAME, "--resource-group", RESOURCE_GROUP], capture_output=True, text=True)
    if check_app.returncode != 0:
        print(f"Web app '{APP_NAME}' does not exist yet. Creating with Linux Node 20 runtime...")
        # Get existing plan from rg-nyagah-fee
        plan_cmd = subprocess.run([az_cmd, "appservice", "plan", "list", "--resource-group", RESOURCE_GROUP, "--query", "[0].name", "-o", "tsv"], capture_output=True, text=True)
        plan_name = plan_cmd.stdout.strip()
        if not plan_name:
            plan_name = "asp-biftu-plan"
            print(f"Creating App Service Plan {plan_name}...")
            subprocess.run([az_cmd, "appservice", "plan", "create", "--name", plan_name, "--resource-group", RESOURCE_GROUP, "--sku", "B1", "--is-linux"], check=True)
        print(f"Creating Web App {APP_NAME} on plan {plan_name}...")
        subprocess.run([az_cmd, "webapp", "create", "--name", APP_NAME, "--resource-group", RESOURCE_GROUP, "--plan", plan_name, "--runtime", "NODE:20-lts"], check=True)

    print("Deploying zip package via az webapp deploy...")
    deploy_cmd = [
        az_cmd, "webapp", "deploy",
        "--resource-group", RESOURCE_GROUP,
        "--name", APP_NAME,
        "--src-path", ZIP_NAME,
        "--type", "zip"
    ]
    deploy_res = subprocess.run(deploy_cmd, capture_output=True, text=True)
    print(deploy_res.stdout)
    if deploy_res.stderr:
        print(deploy_res.stderr)
    print(f"\nDeployment complete! Your site is live at: https://{APP_NAME}.azurewebsites.net/")

if __name__ == "__main__":
    deploy()
