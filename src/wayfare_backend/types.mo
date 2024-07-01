import Text "mo:base/Text";

module Types{
    public type User = {
        name: Text;
        var accountBalance: Int;
        email: Text;
        phone: ?Text;
        paymentMethods: ?[Text];
        tickets: ?[Text];
        password: Text;
        var isLoggedIn: Bool;

    };

    type Ticket = {
        code: Text;
        seatNumber: Nat;
        providerId: Text;
        departLocation: Text;
        destination: Text;
        isValid: Bool;
        route: Text;
        passengerName: Text;
        purchaseTime: Text;
        etd: Text;               //Estimated time of depature
        eta: Text;               //Estimated time of arrival
    };

    type Provider = {
        name: Text;
        id: Text;
        info: Text;
        routes: [Text];
        prices: [Nat];
    }
};