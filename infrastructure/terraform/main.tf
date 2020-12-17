provider "azurerm" {
  version = "~>2.0"
  features {}
}


resource "azurerm_resource_group" "rg-survey-app" {
  name     = "survey-app"
  location = var.location
}
