import { describe, expect, it } from "vitest";

import { needsAck } from "./ack";

describe("needsAck", () => {
  it("is true when approved, requires ack, and user never acked", () => {
    expect(
      needsAck({
        status: "approved",
        requiresAck: true,
        approvedVersion: 3,
        userAckVersion: null,
      }),
    ).toBe(true);
    expect(
      needsAck({
        status: "approved",
        requiresAck: true,
        approvedVersion: 3,
        userAckVersion: undefined,
      }),
    ).toBe(true);
  });

  it("is true when user ack is stale after re-approve", () => {
    expect(
      needsAck({
        status: "approved",
        requiresAck: true,
        approvedVersion: 4,
        userAckVersion: 3,
      }),
    ).toBe(true);
  });

  it("is false when user ack matches approved version", () => {
    expect(
      needsAck({
        status: "approved",
        requiresAck: true,
        approvedVersion: 3,
        userAckVersion: 3,
      }),
    ).toBe(false);
  });

  it("is false when not approved", () => {
    expect(
      needsAck({
        status: "draft",
        requiresAck: true,
        approvedVersion: 3,
        userAckVersion: null,
      }),
    ).toBe(false);
    expect(
      needsAck({
        status: "in_review",
        requiresAck: true,
        approvedVersion: 3,
        userAckVersion: null,
      }),
    ).toBe(false);
  });

  it("is false when requiresAck is false", () => {
    expect(
      needsAck({
        status: "approved",
        requiresAck: false,
        approvedVersion: 3,
        userAckVersion: null,
      }),
    ).toBe(false);
  });

  it("is false when approvedVersion is null", () => {
    expect(
      needsAck({
        status: "approved",
        requiresAck: true,
        approvedVersion: null,
        userAckVersion: null,
      }),
    ).toBe(false);
  });
});
