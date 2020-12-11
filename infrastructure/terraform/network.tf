resource "azurerm_virtual_network" "survey-vnet" {
  name                = "survey-vnet"
  resource_group_name = azurerm_resource_group.rg-survey-app.name
  address_space       = ["10.0.0.0/16"]
  location            = var.location
}


resource "azurerm_subnet" "survey-subnet" {
  name                 = "survey-subnet"
  resource_group_name  = azurerm_resource_group.rg-survey-app.name
  virtual_network_name = azurerm_virtual_network.survey-vnet.name
  address_prefix       = "10.0.0.0/24"
}


