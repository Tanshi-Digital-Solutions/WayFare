// main.mo
import Types "types";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Result "mo:base/Result";
//import Option "mo:base/Option";

actor Main {
    private let userMap = TrieMap.TrieMap<Text, Types.User>(Text.equal, Text.hash);

    public func createUser(name: Text, email: Text, password: Text) : async Result.Result<Text, Text> {
        switch (userMap.get(email)) {
            case (null) {
                let newUser: Types.User = {
                    name = name;
                    email = email;
                    password = password;
                    var accountBalance = 0;
                    paymentMethods = ?["MTN", "Airtel"];
                    phone = ?"0";
                    tickets = ?["0", "1"];
                    var isLoggedIn = false;
                };
                userMap.put(email, newUser);
                #ok("User created successfully")
            };
            case (?_) {
                #err("User with this email already exists")
            };
        };
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

   
}