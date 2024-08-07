// types.mo
import Text "mo:base/Text";
import Time "mo:base/Time";

module {
    public type User = {
        var name: Text;
        var accountBalance: Int;
        var pendingDeposits: [PendingDeposit];
        var trips: Nat;
        var totalDistance: Nat;
        var email: Text;
        var phone: ?Text;
        var paymentMethods: ?[Text];
        var tickets: ?[Text];
        var password: Text;
        var isLoggedIn: Bool;
        uniqueCode: Text;
        var internetIdentity: ?Principal; 
    };

    public type Ticket = {
        code: Text;
        providerId: Text;
        departLocation: Text;
        destination: Text;
        distance: Nat;
        trip: Nat;
        passengerName: Text;
        price: Nat;
        paymentMethod: Text;
        departureDateTime: Text;
        status: Text;
        purchaseTime: Time.Time;
        seat: Text;
        userEmail: Text;
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
        var isAgent: Bool;
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
        trips : Nat;
        totalDistance : Nat;
        isLoggedIn : Bool;
        uniqueCode : Text;
        internetIdentity : ?Principal;
    };

    public type SupportMessage = {
        
        userEmail: Text;
        message: Text;
        timestamp: Time.Time;
    };
}