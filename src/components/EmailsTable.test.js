import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import EmailsTable, { GET_EMAILS, DELETE_EMAIL, MARK_AS_SEEN } from "./EmailsTable";

jest.mock("@nhost/react", () => ({
  useUserData: () => ({ id: "test-user-id" }),
}));
jest.spyOn(global.Date, "now").mockImplementation(() =>
  new Date("2023-01-01T00:00:00Z").getTime()
);

global.confirm = jest.fn(() => true);

beforeAll(() => {
  jest.useFakeTimers().setSystemTime(new Date("2023-01-01T00:00:00Z"));
});

const mockEmails = [
  {
    id: "1",
    email: "user1@example.com",
    description: "Test description",
    created_at: "2023-01-20T12:34:56Z",
    seen: false,
    seen_at: null,
    img_text: null,
  },
  {
    id: "2",
    email: "user2@example.com",
    description: "Another test",
    created_at: "2023-01-19T14:22:36Z",
    seen: true,
    seen_at: "2023-02-18T14:12:36Z",
    img_text: null,
  },
];

const mocks = [
  {
    request: {
      query: GET_EMAILS,
      variables: { user: "test-user-id" },
    },
    result: { data: { emails: mockEmails } },
  },

  {
    request: {
      query: MARK_AS_SEEN,
      variables: { id: "1", seenAt: "2023-01-01T00:00:00Z" },
    },
    result: { data: { update_emails: { affected_rows: 1 } } },
  },

  {
    request: {
      query: GET_EMAILS,
      variables: { user: "test-user-id" },
    },
    result: {
      data: {
        emails: [
          { ...mockEmails[0], seen: true, seen_at: "2023-01-01T00:00:00Z" },
          mockEmails[1],
        ],
      },
    },
  },

  {
    request: {
      query: DELETE_EMAIL,
      variables: { id: "1" },
    },
    result: { data: { delete_emails: { affected_rows: 1 } } },
  },

  {
    request: {
      query: GET_EMAILS,
      variables: { user: "test-user-id" },
    },
    result: { data: { emails: [mockEmails[1]] } },
  },
];

afterEach(() => jest.clearAllMocks());

describe("EmailsTable", () => {
  test("renders emails successfully", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EmailsTable />
      </MockedProvider>
    );

    expect(await screen.findByText("user1@example.com")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("Unseen")).toBeInTheDocument();
    expect(screen.getByText("Seen")).toBeInTheDocument();
  });

  test("shows loading spinner", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <EmailsTable />
      </MockedProvider>
    );

    expect(document.querySelector(".loader")).toBeInTheDocument();
  });

  test("shows error on failure", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_EMAILS,
          variables: { user: "test-user-id" },
        },
        error: new Error("Failed to fetch emails"),
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <EmailsTable />
      </MockedProvider>
    );

    expect(
      await screen.findByText("Error loading emails: Failed to fetch emails")
    ).toBeInTheDocument();
  });

  test("marks email as seen", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EmailsTable />
      </MockedProvider>
    );

    fireEvent.click(await screen.findByText("Mark as Seen"));

    expect(await screen.findAllByText("Seen")).toHaveLength(2);
  });

  test("deletes email", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EmailsTable />
      </MockedProvider>
    );

    const deleteButtons = await screen.findAllByLabelText("delete email");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("user1@example.com")).toBeNull();
    });
  });

  test("shows empty state", async () => {
    const emptyMocks = [
      {
        request: { query: GET_EMAILS, variables: { user: "test-user-id" } },
        result: { data: { emails: [] } },
      },
    ];

    render(
      <MockedProvider mocks={emptyMocks} addTypename={false}>
        <EmailsTable />
      </MockedProvider>
    );

    expect(await screen.findByText("No emails found")).toBeInTheDocument();
  });
});
