import { supabase } from "./supabase";

type PresenceStatus = "SUBSCRIBED" | "TIMED_OUT" | "CHANNEL_ERROR" | "CLOSED";

export const trackPresence = (userId: string, vibe = "clear") => {
  const channel = supabase.channel("presence-room");

  channel
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      console.log("Who is here:", state);
    })
    .subscribe(async (status: PresenceStatus) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
          vibe,
        });
      }
    });

  return () => {
    void channel.unsubscribe();
  };
};
