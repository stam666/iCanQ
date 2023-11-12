@auth-service
Feature: Auth Service
    Scenario Outline: Successfully SignIn as a customer in iCanQ
        Given I am a customer
        When I sign in with <username> and <password>
        Then I get response code <responseCode>
        Examples:
            | username | password | responseCode |
            | "parn_customer" | "12345678" | 200 |