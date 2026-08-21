import { useState } from "react";

import { AxiosError } from "axios";

import {
  Check,
  ChevronLeft,
  Mail,
  MailOpen,
  RefreshCcw,
  Trash2,
  X,
} from "lucide-react";

import {
  useContactMessages,
  useDeleteContactMessage,
  useUpdateContactMessage,
} from "../../hooks/useContactMessages";

import type {
  ContactMessage,
} from "../../types/contact-message";

type MessageFilter = "all" | "unread";

const getErrorMessage = (
  error: unknown
) => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | {
          message?: string;
          errors?: Record<string, string>;
        }
      | undefined;

    if (data?.errors) {
      return Object.values(
        data.errors
      )[0];
    }

    if (data?.message) {
      return data.message;
    }
  }

  return "Something went wrong. Please try again.";
};

const formatDate = (
  value: string
) => {
  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(value));
};

const MessagesPage = () => {
  const [
    filter,
    setFilter,
  ] = useState<MessageFilter>("all");

  const unreadOnly =
    filter === "unread";

  const {
    data: messages = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useContactMessages(
    unreadOnly
  );

  const updateMessage =
    useUpdateContactMessage();

  const deleteMessage =
    useDeleteContactMessage();

  const [
    selectedMessage,
    setSelectedMessage,
  ] = useState<ContactMessage | null>(
    null
  );

  const [
    messageToDelete,
    setMessageToDelete,
  ] = useState<ContactMessage | null>(
    null
  );

  const unreadCount =
    messages.filter(
      (message) => !message.is_read
    ).length;

  const handleOpenMessage = async (
    message: ContactMessage
  ) => {
    setSelectedMessage(message);

    if (!message.is_read) {
      try {
        await updateMessage.mutateAsync({
          id: message.id,
          payload: {
            is_read: true,
          },
        });
      } catch {
        // Message can still be viewed even if
        // updating its read status fails.
      }
    }
  };

  const handleToggleReadStatus = async (
    message: ContactMessage
  ) => {
    try {
      const updatedMessage =
        await updateMessage.mutateAsync({
          id: message.id,
          payload: {
            is_read: !message.is_read,
          },
        });

      if (
        selectedMessage?.id ===
        updatedMessage.id
      ) {
        setSelectedMessage(
          updatedMessage
        );
      }
    } catch {
      // Existing server state remains unchanged.
    }
  };

  const handleDelete = async () => {
    if (!messageToDelete) {
      return;
    }

    try {
      await deleteMessage.mutateAsync(
        messageToDelete.id
      );

      if (
        selectedMessage?.id ===
        messageToDelete.id
      ) {
        setSelectedMessage(null);
      }

      setMessageToDelete(null);
    } catch {
      // Error is shown in the delete modal.
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading messages...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {getErrorMessage(error)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Messages
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage messages submitted
            through your portfolio contact form.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCcw
            size={17}
            className={
              isFetching
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() =>
            setFilter("all")
          }
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === "all"
              ? "bg-gray-900 text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          All Messages
        </button>

        <button
          type="button"
          onClick={() =>
            setFilter("unread")
          }
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            filter === "unread"
              ? "bg-gray-900 text-white"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <Mail
            size={42}
            className="text-gray-400"
          />

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            {filter === "unread"
              ? "No unread messages"
              : "No messages yet"}
          </h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            {filter === "unread"
              ? "You have no unread contact messages."
              : "Messages submitted through your contact form will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="divide-y divide-gray-200">
            {messages.map(
              (message) => (
                <div
                  key={message.id}
                  className={`flex cursor-pointer items-start gap-4 px-5 py-4 transition hover:bg-gray-50 ${
                    !message.is_read
                      ? "bg-gray-50/70"
                      : ""
                  }`}
                  onClick={() =>
                    handleOpenMessage(
                      message
                    )
                  }
                >
                  <div className="mt-1 shrink-0">
                    {message.is_read ? (
                      <MailOpen
                        size={19}
                        className="text-gray-400"
                      />
                    ) : (
                      <Mail
                        size={19}
                        className="text-gray-900"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm ${
                            message.is_read
                              ? "font-medium text-gray-700"
                              : "font-semibold text-gray-900"
                          }`}
                        >
                          {message.name}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          {message.email}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs text-gray-400">
                        {formatDate(
                          message.created_at
                        )}
                      </span>
                    </div>

                    <p
                      className={`mt-2 truncate text-sm ${
                        message.is_read
                          ? "text-gray-600"
                          : "font-medium text-gray-900"
                      }`}
                    >
                      {message.subject ||
                        "No subject"}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {message.message}
                    </p>
                  </div>

                  <div
                    className="flex shrink-0 gap-2"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleReadStatus(
                          message
                        )
                      }
                      disabled={
                        updateMessage.isPending
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      aria-label={
                        message.is_read
                          ? "Mark as unread"
                          : "Mark as read"
                      }
                    >
                      {message.is_read ? (
                        <Mail size={16} />
                      ) : (
                        <Check size={16} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setMessageToDelete(
                          message
                        )
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      aria-label="Delete message"
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() =>
              setSelectedMessage(null)
            }
            className="absolute inset-0 bg-black/50"
            aria-label="Close message"
          />

          <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
              <div className="min-w-0 pr-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedMessage.subject ||
                    "No subject"}
                </h2>

                <p className="mt-2 text-sm font-medium text-gray-800">
                  {selectedMessage.name}
                </p>

                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-sm text-gray-500 hover:text-gray-900 hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedMessage(null)
                }
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5">
              <div className="mb-5 text-xs text-gray-400">
                Received{" "}
                {formatDate(
                  selectedMessage.created_at
                )}
              </div>

              <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex flex-wrap justify-between gap-3 border-t border-gray-200 px-6 py-4">
              <a
                href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                  `Re: ${
                    selectedMessage.subject ||
                    "Your message"
                  }`
                )}`}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Reply
              </a>

              <button
                type="button"
                onClick={() =>
                  handleToggleReadStatus(
                    selectedMessage
                  )
                }
                disabled={
                  updateMessage.isPending
                }
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {selectedMessage.is_read
                  ? "Mark as Unread"
                  : "Mark as Read"}
              </button>
            </div>
          </div>
        </div>
      )}

      {messageToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() =>
              !deleteMessage.isPending &&
              setMessageToDelete(null)
            }
            className="absolute inset-0 bg-black/50"
            aria-label="Close"
          />

          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Message
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Delete the message from{" "}
              <span className="font-medium text-gray-900">
                {messageToDelete.name}
              </span>
              ? This cannot be undone.
            </p>

            {deleteMessage.isError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {getErrorMessage(
                  deleteMessage.error
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setMessageToDelete(null)
                }
                disabled={
                  deleteMessage.isPending
                }
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  deleteMessage.isPending
                }
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMessage.isPending
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;