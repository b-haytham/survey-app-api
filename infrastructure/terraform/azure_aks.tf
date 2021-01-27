resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.cluster_name
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = var.cluster_name


  default_node_pool {
    name       = "default"
    node_count = var.system_node_count
    vm_size    = "Standard_DS2_v2"
    type = "VirtualMachineScaleSets"
    availability_zones = [ 1, 2, 3 ]
    enable_auto_scaling = false
  }

  identity {
    type = "SystemAssigned"
  }
}


