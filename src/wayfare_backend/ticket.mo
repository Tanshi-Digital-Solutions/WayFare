// Ticket.mo Wayfare
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Types "types";

module {
    public type MainInterface = actor {
        getUser : (Text) -> async Result.Result<Types.ShareableUser, Text>;
        updateUser : (Types.ShareableUser) -> async Result.Result<Text, Text>;
    };

    public class Ticket(mainInterface : MainInterface) {
        private let ticketMap = TrieMap.TrieMap<Text, Types.Ticket>(Text.equal, Text.hash);
        private var ticketCounter : Nat = 0;

        public func getAllTickets() : async [Types.Ticket] {
            Iter.toArray(ticketMap.vals())
        };

        private func generateTicketCode() : Text {
            ticketCounter += 1;
            Int.toText(Time.now()) # "-" # Nat.toText(ticketCounter)
        };

        public func createTicket(
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
        ) : async Result.Result<Types.Ticket, Text> {
            let newCode = generateTicketCode();
            
            let newTicket : Types.Ticket = {
                code = newCode;
                providerId = providerId;
                departLocation = departLocation;
                destination = destination;
                distance = distance;
                trip = trip;
                passengerName = passengerName;
                price = price;
                paymentMethod = paymentMethod;
                departureDateTime = departureDateTime;
                status = "ISSUED";
                purchaseTime = Time.now();
                seat = seat;
                userEmail = userEmail;
            };
            ticketMap.put(newCode, newTicket);
            #ok(newTicket)
        };

        public func getTicket(ticketCode: Text) : async Result.Result<Types.Ticket, Text> {
            switch (ticketMap.get(ticketCode)) {
                case (?ticket) { #ok(ticket) };
                case null { #err("Ticket not found") };
            }
        };

        public func updateTicketStatus(ticketCode: Text, newStatus: Text) : Result.Result<Text, Text> {
            switch (ticketMap.get(ticketCode)) {
                case (?ticket) {
                    let updatedTicket = {
                        ticket with 
                        status = newStatus;
                    };
                    ticketMap.put(ticketCode, updatedTicket);
                    #ok("Ticket status updated successfully")
                };
                case null { #err("Ticket not found") };
            }
        };

        public func validateTicket(ticketCode: Text, userUniqueCode: Text) : async Result.Result<Bool, Text> {
            switch (ticketMap.get(ticketCode)) {
                case (?ticket) {
                    if (ticket.status == "USED") {
                        return #err("Ticket has already been used");
                    };
                    
                    // Update ticket status
                    let updatedTicket = {
                        ticket with 
                        status = "USED";
                    };
                    ticketMap.put(ticketCode, updatedTicket);

                    // Get user from main canister
                    let userResult = await mainInterface.getUser(userUniqueCode);
                    switch (userResult) {
                        case (#ok(user)) {
                            // Update user stats
                            let updatedUser : Types.ShareableUser = {
                                user with
                                trips = user.trips + ticket.trip;
                                totalDistance = user.totalDistance + ticket.distance;
                            };
                            // Update user in main canister
                            let updateResult = await mainInterface.updateUser(updatedUser);
                            switch (updateResult) {
                                case (#ok(_)) { #ok(true) };
                                case (#err(e)) { #err("Failed to update user: " # e) };
                            };
                        };
                        case (#err(e)) { #err("User not found: " # e) };
                    };
                };
                case null { #err("Ticket not found") };
            }
        };
    };

    
}