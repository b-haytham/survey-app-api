resource "azurerm_kubernetes_cluster" "survey-cluster" {
  name                = var.cluster-name
  location            = var.location
  resource_group_name = azurerm_resource_group.rg-survey-app.name
  dns_prefix          = "demo-cluster"


  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "B2S"
  }

  service_principal {
    client_id     = azuread_service_principal.aks_sp.application_id
    client_secret = random_string.aks_sp_password.result
  }
}


output "client_certificate" {
  value = azurerm_kubernetes_cluster.survey-cluster.kube_config.0.client_certificate
}

output "kube_config" {
  value = azurerm_kubernetes_cluster.survey-cluster.kube_config_raw
}
