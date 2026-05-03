create table if not exists tai_khoan (
    id bigserial primary key,
    username varchar(100) not null,
    password varchar(255) not null,
    full_name varchar(150),
    email varchar(150),
    phone varchar(20),
    role varchar(30) not null,
    enabled boolean not null,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    constraint uq_tai_khoan_username unique (username),
    constraint uq_tai_khoan_email unique (email)
);

create table if not exists refresh_token (
    id bigserial primary key,
    token varchar(512) not null,
    user_id bigint not null,
    expires_at timestamptz not null,
    revoked boolean not null,
    created_at timestamptz not null,
    constraint uq_refresh_token_token unique (token),
    constraint fk_refresh_token_user foreign key (user_id) references tai_khoan(id) on delete cascade
);

