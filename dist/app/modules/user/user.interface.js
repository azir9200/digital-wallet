"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsActive = exports.AgentStatus = exports.Status = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["AGENT"] = "AGENT";
})(Role || (exports.Role = Role = {}));
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["InACTIVE"] = "InACTIVE";
    Status["BLOCKED"] = "BLOCKED";
})(Status || (exports.Status = Status = {}));
var AgentStatus;
(function (AgentStatus) {
    AgentStatus["PENDING"] = "pending";
    AgentStatus["APPROVED"] = "approved";
    AgentStatus["SUSPENDED"] = "suspended";
})(AgentStatus || (exports.AgentStatus = AgentStatus = {}));
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
    IsActive["BLOCKED"] = "BLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
