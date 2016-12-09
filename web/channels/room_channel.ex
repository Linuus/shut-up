defmodule ShutUp.RoomChannel do
  use ShutUp.Web, :channel
  require Logger

  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      send self, {:after_join, payload}
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("new:msg", msg, socket) do
    broadcast socket, "new:msg", %{user: socket.assigns[:user], body: msg["body"]}
    {:reply, {:ok, %{msg: msg["body"]}}, socket}
  end

  def handle_info({:after_join, msg}, socket) do
    broadcast! socket, "user:entered", %{user: socket.assigns[:user]}
    push socket, "join", %{status: "connected"}
    {:noreply, socket}
  end

  def terminate(reason, _socket) do
    Logger.debug "> leave #{inspect reason}"
    :ok
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
