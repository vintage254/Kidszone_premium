import React from "react";
import Link from "next/link";
import { adminGetThreads, adminGetThread, adminSendMessageForm, markThreadReadByAdmin } from "@/lib/actions/chat.actions";

type PageProps = {
  searchParams?: { userId?: string };
};

export default async function Page({ searchParams }: PageProps) {
  const activeUserId = searchParams?.userId || "";

  const threadsRes = await adminGetThreads();
  const threads = threadsRes.success ? threadsRes.data : [];

  let messagesRes: Awaited<ReturnType<typeof adminGetThread>> | null = null;
  if (activeUserId) {
    // Mark as read for admin and then fetch messages
    await markThreadReadByAdmin(activeUserId);
    messagesRes = await adminGetThread(activeUserId);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Customer Support Chat</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threads list */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 font-medium">Conversations</div>
          <ul className="divide-y">
            {threads.length === 0 && (
              <li className="p-4 text-sm text-gray-500">No conversations yet.</li>
            )}
            {threads.map((t) => (
              <li key={t.userId} className="p-3 hover:bg-gray-50">
                <Link href={`/admin/chatbox?userId=${t.userId}`} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{t.userName || t.userEmail || t.userId.slice(0, 8)}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[220px]">{t.lastMessage}</div>
                  </div>
                  {t.unreadByAdmin > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs w-6 h-6">
                      {t.unreadByAdmin}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Message history + composer */}
        <div className="lg:col-span-2 border rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 font-medium">{activeUserId ? "Conversation" : "Select a conversation"}</div>

          {!activeUserId && (
            <div className="p-6 text-sm text-gray-500">Choose a conversation from the left to view and reply.</div>
          )}

          {activeUserId && messagesRes?.success && (
            <div className="p-4">
              {/* Message history table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="px-3 py-2">Time</th>
                      <th className="px-3 py-2">Sender</th>
                      <th className="px-3 py-2">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messagesRes.data.map((m) => (
                      <tr key={m.id} className="border-t">
                        <td className="px-3 py-2 text-gray-500">{m.createdAt ? new Date(m.createdAt as unknown as string).toLocaleString() : "-"}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${m.sender === "ADMIN" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                            {m.sender === "ADMIN" ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-pre-wrap">{m.content}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Reply composer */}
              <div className="mt-4 border-t pt-4">
                <form action={adminSendMessageForm} className="flex gap-2">
                  <input type="hidden" name="userId" value={activeUserId} />
                  <input
                    name="content"
                    type="text"
                    placeholder="Type a reply..."
                    className="flex-1 border rounded px-3 py-2 text-sm outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 text-sm"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

