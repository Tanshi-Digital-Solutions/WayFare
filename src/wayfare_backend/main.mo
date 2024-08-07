// main.mo
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
    private let agentMap = TrieMap.TrieMap<Text, Types.Agent>(Text.equal, Text.hash);
    private let supportMessages = TrieMap.TrieMap<Text, [Types.SupportMessage]>(Text.equal, Text.hash);

    public shared(msg) func addSupportMessage(userEmail: Text, message: Text) : async Result.Result<Text, Text> {
        let newMessage : Types.SupportMessage = {
            userEmail = userEmail;
            message = message;
            timestamp = Time.now();
        };
    
        switch (supportMessages.get(userEmail)) {
            case (null) {
                supportMessages.put(userEmail, [newMessage]);
            };
            case (?existingMessages) {
                let updatedMessages = Array.append(existingMessages, [newMessage]);
                supportMessages.put(userEmail, updatedMessages);
            };
        };
    
        #ok(userEmail)
    };
    

    public shared(msg) func getUser(userUniqueCode: Text) : async Result.Result<Types.ShareableUser, Text> {
        let userEntries = Iter.toArray(userMap.entries());
        let userOpt = Array.find(userEntries, func(entry: (Text, Types.User)): Bool {
        entry.1.uniqueCode == userUniqueCode
        });
    
      switch (userOpt) {
            case (?userEntry) {
                let user = userEntry.1;
                let shareableUser : Types.ShareableUser = {
                    name = user.name;
                    email = user.email;
                    accountBalance = user.accountBalance;
                    pendingDeposits = user.pendingDeposits;
                    paymentMethods = user.paymentMethods;
                    phone = user.phone;
                    tickets = user.tickets;
                    trips = user.trips;
                    totalDistance = user.totalDistance;
                    isLoggedIn = user.isLoggedIn;
                    uniqueCode = user.uniqueCode;
                    internetIdentity = user.internetIdentity;
                };
                #ok(shareableUser)
            };
            case null {
                return #err("User not found");
            };
        }; 
    };

    public shared(msg) func updateUser(updatedUser: Types.ShareableUser) : async Result.Result<Text, Text> {
        let userEntries = Iter.toArray(userMap.entries());
        let userOpt = Array.find(userEntries, func(entry: (Text, Types.User)): Bool {
        entry.1.uniqueCode == updatedUser.uniqueCode
        });
        
        switch (userOpt) {
            case (?userEntry) {
                var user = userEntry.1;
                user.name := updatedUser.name;
                user.email := updatedUser.email;
                user.accountBalance := updatedUser.accountBalance;
                user.pendingDeposits := updatedUser.pendingDeposits;
                user.paymentMethods := updatedUser.paymentMethods;
                user.phone := updatedUser.phone;
                user.tickets := updatedUser.tickets;
                user.trips := updatedUser.trips;
                user.totalDistance := updatedUser.totalDistance;
                user.isLoggedIn := updatedUser.isLoggedIn;
                user.internetIdentity := updatedUser.internetIdentity;
                
                userMap.put(user.email, user);
                #ok("User updated successfully")
            };
            case (null) {
                #err("User not found")
            };
        };
    };

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

    public shared(msg) func createUserWithInternetIdentity(name: Text, email: Text) : async Result.Result<Text, Text>{
        let caller = msg.caller;
        switch (userMap.get(email)) {
            case (null) {
            let uniqueCode = generateUniqueCode();
            let newUser: Types.User = {
                var name = name;
                var email = email;
                var password = ""; // No password for II users
                var accountBalance = 1220;
                var pendingDeposits = [];
                var paymentMethods = ?["MTN", "Airtel"];
                var phone = ?"0";
                var tickets = ?[];
                var trips = 0;
                var totalDistance = 0;
                var isLoggedIn = true; // Set to true immediately
                uniqueCode = uniqueCode;
                var internetIdentity = ?caller;
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

    public func login(email: Text, password: Text): async Result.Result<Text, Text> {
        switch (findUserByEmail(email)) {
            case (?user) {
                if (user.password == password) {
                    user.isLoggedIn := true;
                    userMap.put(email, user);
                    #ok("Logged in successfully")
                } else {
                    #err("Incorrect password")
                };
            };
            case (null) {
                #err("User not found")
            };
        };
    };

    public shared(msg) func loginWithInternetIdentity() : async Result.Result<Text, Text> {
    let caller = msg.caller;
    switch (getUserByPrincipal(caller)) {
        case (?user) {
            user.isLoggedIn := true;
            userMap.put(user.email, user);
            #ok("Logged in successfully")
        };
        case (null) {
            #err("No user found for this Internet Identity")
        };
    };
};

    public shared(msg) func linkInternetIdentity(email: Text, password: Text) : async Result.Result<Text, Text> {
        switch (findUserByEmail(email)) {
            case (?user) {
                if (user.password == password) {
                    user.internetIdentity := ?msg.caller;
                    userMap.put(email, user);
                    #ok("Internet Identity linked successfully")
                } else {
                    #err("Incorrect password")
                };
            };
            case (null) {
                #err("User not found")
            };
        };
    };

    public shared(msg) func createAgent(name: Text, email: Text, password: Text) : async Result.Result<Text, Text> {
        
        switch (agentMap.get(email)) {
            case (null) {
                let newAgent: Types.Agent = {
                    id = generateUniqueCode();
                    name = name;
                    email = email;
                    password = password;
                    var isAgent = true;
                    var isLoggedIn = false;
                };
                agentMap.put(email, newAgent);
                #ok("Agent created successfully")
            };
            case (?_) {
                #err("Agent with this email already exists")
            };
        };
    };

    public shared(msg) func agentLogin(email: Text, password: Text) : async Result.Result<Text, Text> {
        
        switch (agentMap.get(email)) {
            case (?agent) {
                if (agent.password == password ) {
                    agent.isLoggedIn := true;
                    agentMap.put(email, agent);
                    #ok("Agent logged in successfully")
                } else {
                    #err("Incorrect password or Internet Identity")
                };
            };
            case (null) {
                #err("Agent not found")
            };
        };
    };

    public query func getUserName(email: Text): async Result.Result<Text, Text> {
        switch (findUserByEmail(email)) {
            case (?user) {
                #ok(user.name)
            };
            case (null) {
                #err("User not found")
            };
        };
    };

    public query func getUserTrips(email: Text): async Result.Result<Int, Text> {
        switch (findUserByEmail(email)) {
            case (?user) {
                #ok(user.trips)
            };
            case (null) {
                #err("User not found")
            };
        };
    };
    
    public query func getUserTotalDistance(email: Text): async Result.Result<Int, Text> {
        switch (findUserByEmail(email)) {
            case (?user) {
                #ok(user.totalDistance)
            };
            case (null) {
                #err("User not found")
            };
        };
    };
    public func checkDepositStatus(email: Text, amount: Int): async Result.Result<Text, Text> {
        switch (findUserByEmail(email)) {
            case (?user) {
                switch (Array.find(user.pendingDeposits, func(d: Types.PendingDeposit): Bool { d.amount == amount })) {
                    case (?deposit) {
                        #ok("pending")
                    };
                    case (null) {
                        // Check if the amount has been added to the account balance
                        if (user.accountBalance >= amount) {
                            #ok("verified")
                        } else {
                            #err("Deposit not found or not verified")
                        }
                    };
                };
            };
            case (null) {
                #err("User not found")
            };
        };
    };

    public query func getBalance(email: Text): async Result.Result<Int, Text> {
        switch (findUserByEmail(email)) {
            case (?user) {
                #ok(user.accountBalance)
            };
            case (null) {
                #err("User not found")
            };
        };
    };

    public func initiateDeposit(email: Text, amount: Int): async Result.Result<Text, Text> {
        switch (findUserByEmail(email)){
            case (?user){
                if(amount > 0) {
                    let pendingDeposit : Types.PendingDeposit = {
                        amount = amount;
                        timestamp = Time.now();
                    };
                    user.pendingDeposits := Array.append(user.pendingDeposits, [pendingDeposit]);
                    userMap.put(email, user);
                    #ok("Deposit initiated, please wait for confirmation");
                } else {
                    #err("Invalid deposit amount");
                };
            };
            case (null) {
                #err("User not found");
            };
        };
    };

    public func verifyDeposit(email: Text, amount: Int, password: Text): async Result.Result<Text, Text> {
        switch (findUserByEmail(email)) {
            case (?user) {
                if (user.password == password) {
                    switch (Array.find(user.pendingDeposits, func(d: Types.PendingDeposit): Bool { d.amount == amount })) {
                        case (?deposit) {
                            user.accountBalance += deposit.amount;
                            user.pendingDeposits := Array.filter(user.pendingDeposits, func(d: Types.PendingDeposit): Bool { d.amount != amount });
                            userMap.put(email, user);
                            #ok("Deposit of " # Int.toText(amount) # " successful")
                        };
                        case (null) {
                            #err("Deposit not found")
                        };
                    };
                } else {
                    #err("Incorrect password")
                };
            };
            case (null) {
                #err("User not found")
            };
        };
    };

    public query func getPendingDeposits(email: Text): async Result.Result<[Types.PendingDeposit], Text> {
        switch (findUserByEmail(email)) {
            case (?user) {
                #ok(user.pendingDeposits)
            };
            case (null) {
                #err("User not found")
            };
        };
    };

    

    public query func getUserTickets(email: Text): async Result.Result<[Text], Text> {
        switch (findUserByEmail(email)) {
            case (?user) {
                switch (user.tickets) {
                    case (?tickets) {
                        #ok(tickets)
                    };
                    case (null) {
                        #ok([]) // Return an empty array if the user has no tickets
                    };
                };
            };
            case (null) {
                #err("User not found")
            };
        };
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

    // Helper function to get user by Principal
    private func getUserByPrincipal(userPrincipal: Principal) : ?Types.User {
        for ((_, user) in userMap.entries()) {
            switch (user.internetIdentity) {
                case (?id) {
                    if (id == userPrincipal) {
                        return ?user;
                    };
                };
                case (null) {};
            };
        };
        null
    };

    public query func getAllUsers() : async [(Text, Text)] {
        let userEntries = Iter.toArray(userMap.entries());
        Array.map<(Text, Types.User), (Text, Text)>(userEntries, func((email, user): (Text, Types.User)): (Text, Text) {
            (email, user.name)
        })
    };
    public query func getAllSupportMessages() : async [Types.SupportMessage] {
        var allMessages : [Types.SupportMessage] = [];
        for (messages in supportMessages.vals()) {
            allMessages := Array.append(allMessages, messages);
        };
        allMessages
    };

    public func getAllTickets() : async [Types.Ticket] {
        await ticketSystem.getAllTickets()
    }

    

};
