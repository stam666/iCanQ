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
        When I logged in as a <role2>
        And I change the status of the incoming order to <changeStatus>
        Then I should see order status <changeStatus>
        Examples:
            |role| restaurantId | menuId | status | changeStatus | role2 |
            |"customer"| '6548e6f006079d304444f5d6' | '71' | 'pending'| 'cooking'| 'restaurant'|    
            |"customer"| '6548e6f006079d304444f5d6' | '71' | 'pending'| 'complete'| 'restaurant'|
    