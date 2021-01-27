resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  admin_enabled       = false
  sku = "Standard"
}
