// main.mo wayfare
import Types "types";
import Ticket "ticket";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Principal "mo:base/Principal";

actor Main {
    private let userMap = TrieMap.TrieMap<Text, Types.User>(Text.equal, Text.hash);
    

    private let mainInterface : Ticket.MainInterface = actor(Principal.toText(Principal.fromActor(Main)));

    private let ticketSystem = Ticket.Ticket(mainInterface);

    public shared(msg) func createUser(name: Text, email: Text, password: Text) : async Result.Result<Text, Text> {
        switch (userMap.get(email)) {
            case (null) {
                let uniqueCode = generateUniqueCode();
                let newUser: Types.User = {
                    var name = name;
                    var email = email;
                    var password = password;
                    var accountBalance = 1220;
                    var pendingDeposits = [];
                    var paymentMethods = ?["MTN", "Airtel"];
                    var phone = ?"0";
                    var tickets = ?[];
                    var trips = 0;
                    var totalDistance = 0;
                    var isLoggedIn = true;
                    uniqueCode = uniqueCode;
                    var internetIdentity = null;
                };
                userMap.put(email, newUser);
                #ok("User created successfully")
            };
            case (?_) {
                #err("User with this email already exists")
            };
        };
    };

    private func generateUniqueCode() : Text {
        let now = Int.abs(Time.now());
        let randomPart = now % 10000; 
        let uniqueCode = Int.toText(now) # "-" # Int.toText(randomPart);
        return uniqueCode;
    };

    private func findUserByEmail(email: Text): ?Types.User {
        userMap.get(email)
    };

    public shared(msg) func purchaseTicket(
        email: Text,
        providerId: Text,
        departLocation: Text,
        destination: Text,
        distance: Nat,
        trip: Nat,
        passengerName: Text,
        price: Nat,
        paymentMethod: Text,
        departureDateTime: Text,
        seat: Text,
        userEmail: Text
    ) : async Result.Result<Text, Text> {
        // Fetch user by email
            switch (findUserByEmail(email)) {
                case (null) { return #err("User account not found"); };
                case (?user) {
                    if (user.accountBalance < price) {
                        return #err("Insufficient balance");
                    };
            
                    // Deduct the ticket price from the user's balance
                    user.accountBalance -= price;
            
                    // Create ticket using the Ticket canister
                    let ticketResult = await ticketSystem.createTicket(
                        providerId,
                        departLocation,
                        destination,
                        distance,
                        trip,
                        passengerName,
                        price,
                        paymentMethod,
                        departureDateTime,
                        seat,
                        userEmail
                    );
            
                    switch (ticketResult) {
                        case (#ok(ticket)) {
                            // Add the ticket code to the user's tickets array
                            switch (user.tickets) {
                                case (null) { user.tickets := ?[ticket.code]; };
                                case (?existingTickets) { user.tickets := ?Array.append(existingTickets, [ticket.code]); };
                            };
                    
                            // Update the user in the userMap
                            userMap.put(user.email, user);
                    
                            #ok(ticket.code)
                        };
                        case (#err(e)) { #err(e) }
                    }
            }
        }
    };


    public func getTicketInfo(ticketCode: Text) : async Result.Result<Types.Ticket, Text> {
        await ticketSystem.getTicket(ticketCode)
    };

    public func validateTicket(ticketCode: Text) : async Result.Result<Bool, Text> {
        // First, get the ticket info
        let ticketResult = await getTicketInfo(ticketCode);
    
        switch (ticketResult) {
            case (#err(e)) { return #err("Error retrieving ticket: " # e) };
            case (#ok(ticket)) {
                // Use the email from the ticket to find the user
                switch (findUserByEmail(ticket.userEmail)) {
                    case (null) { return #err("User account not found for ticket") };
                    case (?user) {
                        
                    
                        // Validate the ticket
                        let validationResult = await ticketSystem.validateTicket(ticketCode, user.uniqueCode);
                    
                        switch (validationResult) {
                            case (#ok(isValid)) {
                                // Update the user in the userMap
                                userMap.put(user.email, user);
                                #ok(isValid)
                            };
                            case (#err(e)) { #err("Error validating ticket: " # e) }
                        }
                    };
                };
            };
        };
    };

    public query func getAllUsers() : async [(Text, Text)] {
        let userEntries = Iter.toArray(userMap.entries());
        Array.map<(Text, Types.User), (Text, Text)>(userEntries, func((email, user): (Text, Types.User)): (Text, Text) {
            (email, user.name)
        })
    };

    public func getAllTickets() : async [Types.Ticket] {
        await ticketSystem.getAllTickets()
    }
};
