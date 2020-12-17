resource "random_string" "aks_sp_password" {

  length           = 24
  min_upper        = 1
  min_lower        = 1
  min_numeric      = 1
  special          = true
  min_special      = 1
  override_special = "!@-_=+."
}

resource "random_string" "aks_sp_secret" {

  length           = 24
  min_upper        = 1
  min_lower        = 1
  min_numeric      = 1
  special          = true
  min_special      = 1
  override_special = "!@-_=+."
}

resource "azuread_application" "aks_sp" {
  name = "sp-aks-${var.cluster-name}"
}

resource "azuread_service_principal" "aks_sp" {
  application_id               = azuread_application.aks_sp.application_id
  app_role_assignment_required = false
}

resource "azuread_service_principal_password" "aks_sp" {
  service_principal_id = azuread_service_principal.aks_sp.id
  value                = random_string.aks_sp_password.result
  end_date_relative    = "8760h" # 1 year

  lifecycle {
    ignore_changes = [
      value,
      end_date_relative
    ]
  }
}

resource "azuread_application_password" "aks_sp" {
  application_object_id = azuread_application.aks_sp.id
  value                 = random_string.aks_sp_secret.result
  end_date_relative     = "8760h" # 1 year

  lifecycle {
    ignore_changes = [
      value,
      end_date_relative
    ]
  }
}


resource "azurerm_role_assignment" "aks_sp_container_registry" {
  scope                = azurerm_container_registry.survey-app-acr.id
  role_definition_name = "AcrPull"
  principal_id         = azuread_service_principal.aks_sp.object_id
}
