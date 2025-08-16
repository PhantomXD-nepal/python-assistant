
ALTER TABLE public.users
ADD COLUMN duration double precision DEFAULT 3600;

CREATE OR REPLACE FUNCTION public.create_user_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, plan, remaining_instances, duration)
  VALUES (NEW.id, NEW.email_addresses[1]->>'email_address', 'free', 10, 3600);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
