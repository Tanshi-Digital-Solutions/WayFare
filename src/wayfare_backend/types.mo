// types.mo
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

module {
    public type User = {
        var name: Text;
        var accountBalance: Int;
        var pendingDeposits: [PendingDeposit];
        var trips: Int;
        var totalDistance: Nat;
        var email: Text;
        var phone: ?Text;
        var paymentMethods: ?[Text];
        var tickets: ?[Text];
        var password: Text;
        var isLoggedIn: Bool;
        uniqueCode: Text; // Added
        var internetIdentity: ?Principal; // Added
    };

    public type Ticket = {
        code: Text;
        providerId: Text;
        departLocation: Text;
        destination: Text;
        distance: Nat;
        passengerName: Text;
        price: Nat;
        paymentMethod: Text;
        departureDateTime: Text;
        status: Text;
        purchaseTime: Time.Time;
    };

    public type Provider = {
        name: Text;
        id: Text;
        info: Text;
        routes: [Text];
        prices: [Nat];
    };

    public type PendingDeposit = {
        amount: Int;
        timestamp: Int;
    };

    public type Agent = {
        id: Text;
        name: Text;
        email: Text;
        password: Text;
        internetIdentity: Principal;
        var isLoggedIn: Bool;
    };

    public type ShareableUser = {
        name : Text;
        email : Text;
        accountBalance : Int;
        pendingDeposits : [PendingDeposit];
        paymentMethods : ?[Text];
        phone : ?Text;
        tickets : ?[Text];
        trips : Int;
        totalDistance : Nat;
        isLoggedIn : Bool;
        uniqueCode : Text;
        internetIdentity : ?Principal;
    };
}