defmodule ShutUp.PageController do
  use ShutUp.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
