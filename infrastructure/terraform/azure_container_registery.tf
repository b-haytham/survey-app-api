resource "azurerm_container_registry" "survey-app-acr" {
  name                = "surveyappacr"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg-survey-app.name
  admin_enabled       = false

}
