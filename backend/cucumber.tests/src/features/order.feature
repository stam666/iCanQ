@order-service
Feature: Order Service
    Scenario: View all resaturants
        Given I logged in as a <role>
        When I get all restaurants
        Then I should see all restaurants  
        Examples:
            | role |
            | 'customer' |

    Scenario Outline: View all menus of selected restaurant
        Given I logged in as a <role>
        When I get all menus of restaurant <restaurantId>
        Then I should see menuId : <menuId> of selected restaurant
        Examples:
            |role| restaurantId | menuId |
            |'customer'| '6528e3f488f43121d4ac7c18' | 10 |
    
    Scenario Outline: Place new order
        Given I logged in as a <role>
        When I place new order with <menuId> of restaurant <restaurantId>
        Then I should see order status <status>
        Examples:
            |role | restaurantId | menuId | status |
            |"customer"| '6528e3f488f43121d4ac7c18' | '10' | 'pending'|