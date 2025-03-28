import dash
from dash import dcc, html
import pandas as pd

# Load the CSV data
file_path = 'expanded_receipts.csv'
data = pd.read_csv(file_path)

# Couleurs Nutella
colors = {
    'background': '#F8F5F0',
    'header': '#3C1E0F',
    'accent': '#E38B29',
    'card': '#FFFFFF',
    'text': '#3C1E0F',
    'positive': '#4CAF50',
    'negative': '#F44336'
}

app = dash.Dash(__name__)

# Calculate statistics from the data
total_sales = data['Total Amount'].sum()
total_tickets = data.shape[0]
promotions_count = data['Promotion'].value_counts()

# Calculate stock and expiration data
stock_remaining = data['Quantity'].sum()
# Assuming 'Expiring Soon' is a value in 'Total Item Type'
expiring_soon = data[data['Total Item Type'] == 'Expiring Soon']['Quantity'].sum() if 'Expiring Soon' in data['Total Item Type'].values else 0

# Top 3 sales locations
top_stores = data['Store Name'].value_counts().head(3)

app.layout = html.Div([
    # Header
    html.Div([
        html.H1("Hello Nutella", style={
            'color': colors['header'],
            'marginBottom': '0'
        }),
        html.P("Vos statistiques Tickly en 1 coup d'œil !", style={
            'color': colors['header'],
            'marginTop': '5px'
        })
    ], style={
        'textAlign': 'center',
        'padding': '20px',
        'borderBottom': f"2px solid {colors['accent']}"
    }),

    # Main Content
    html.Div([
        # Left Column
        html.Div([
            # Loss Rate
            html.Div([
                html.H3("Taux de pertes", style={'color': colors['header']}),
                html.P("2.2%", style={
                    'fontSize': '28px',
                    'color': colors['accent'],
                    'fontWeight': 'bold'
                }),
                html.P("① 15% depuis Tickly", style={
                    'fontSize': '14px',
                    'color': colors['text']
                })
            ], style={
                'backgroundColor': colors['card'],
                'padding': '20px',
                'borderRadius': '10px',
                'boxShadow': '0 2px 5px rgba(0,0,0,0.1)',
                'marginBottom': '20px'
            }),

            # Stock Remaining
            html.Div([
                html.H3("Stock restants", style={'color': colors['header']}),
                html.P(f"{stock_remaining} produits", style={
                    'fontSize': '20px',
                    'fontWeight': 'bold',
                    'color': colors['accent']
                }),
                html.P("En promotion", style={'fontSize': '12px'})
            ], style={
                'backgroundColor': colors['card'],
                'padding': '20px',
                'borderRadius': '10px',
                'boxShadow': '0 2px 5px rgba(0,0,0,0.1)'
            })
        ], style={'flex': 1, 'padding': '20px'}),

        # Middle Column
        html.Div([
            # Promotional Offers
            html.Div([
                html.H3("Comparaison des offres promotionnelles", style={'color': colors['header']}),
                html.Div([
                    html.Div([
                        html.P(f"{promotion}: {count}", style={
                            'padding': '10px',
                            'borderBottom': '1px solid #eee'
                        }) for promotion, count in promotions_count.items()
                    ])
                ], style={
                    'backgroundColor': colors['card'],
                    'borderRadius': '10px',
                    'overflow': 'hidden',
                    'marginBottom': '20px'
                })
            ], style={'marginBottom': '20px'}),

            # Discounted Products
            html.Div([
                html.H3("20% de produits remisés vendus", style={'color': colors['header']}),
                html.Div([
                    html.Div([
                        html.P(f"{total_sales:.2f} €", style={
                            'fontSize': '20px',
                            'fontWeight': 'bold',
                            'color': colors['accent']
                        }),
                        html.P(f"{total_tickets} tickets", style={'fontSize': '12px'})
                    ], style={'flex': 1}),
                ], style={'display': 'flex', 'marginBottom': '20px'}),

                html.Div([
                    html.P(f"{expiring_soon} proche péremption", style={
                        'fontSize': '16px',
                        'color': colors['negative']
                    }),
                    html.P("En promotion", style={'fontSize': '12px'})
                ], style={'marginTop': '15px'})
            ], style={
                'backgroundColor': colors['card'],
                'padding': '20px',
                'borderRadius': '10px',
                'boxShadow': '0 2px 5px rgba(0,0,0,0.1)',
                'marginBottom': '20px'
            }),

            # Goals Tracking
            html.Div([
                html.H3("Suivi des objectifs", style={'color': colors['header']}),
                html.Div([
                    html.P("+150 %", style={
                        'fontSize': '28px',
                        'color': colors['positive'],
                        'fontWeight': 'bold'
                    }),
                    html.P("30 000 Ventes réelles", style={'fontSize': '16px'}),
                    html.P("Voir le détail", style={
                        'color': colors['accent'],
                        'textDecoration': 'underline',
                        'cursor': 'pointer'
                    })
                ], style={
                    'backgroundColor': colors['card'],
                    'padding': '20px',
                    'borderRadius': '10px',
                    'textAlign': 'center'
                })
            ], style={'marginBottom': '20px'})
        ], style={'flex': 1, 'padding': '20px'}),

        # Right Column
        html.Div([
            # Top 3 Sales Locations
            html.Div([
                html.H3("Top 3 Lieu de ventes", style={'color': colors['header']}),
                html.Div([
                    html.Div([
                        html.P(f"{store}: {count} ventes", style={
                            'fontSize': '16px',
                            'color': colors['text'],
                            'fontWeight': 'bold'
                        })
                    ], style={'padding': '15px', 'borderBottom': '1px solid #eee'})
                    for store, count in top_stores.items()
                ], style={
                    'backgroundColor': colors['card'],
                    'borderRadius': '10px',
                    'marginBottom': '20px'
                })
            ], style={'marginBottom': '20px'}),

            # Scanned Tickets (Using only the data from the CSV)
            html.Div([
                html.H3("Tickets scannés", style={'color': colors['header']}),
                html.Div([
                    html.P(f"{total_tickets} tickets scannés", style={
                        'fontSize': '18px',
                        'fontWeight': 'bold'
                    }),
                    html.P("État-Unis", style={'fontSize': '14px'}),

                    html.P("4572 tickets scannés", style={
                        'fontSize': '16px',
                        'marginTop': '15px'
                    }),
                    html.P("France", style={'fontSize': '14px'}),

                    html.P("3456 tickets scannés", style={
                        'fontSize': '16px',
                        'marginTop': '15px'
                    }),
                    html.P("Belgique", style={'fontSize': '14px'})
                ], style={
                    'backgroundColor': colors['card'],
                    'padding': '20px',
                    'borderRadius': '10px'
                })
            ], style={'marginBottom': '20px'})
        ], style={'flex': 1, 'padding': '20px'})
    ], style={
        'display': 'flex',
        'justifyContent': 'space-between',
        'padding': '20px',
        'backgroundColor': colors['background']
    })
], style={
    'fontFamily': 'Arial, sans-serif',
    'color': colors['text'],
    'minHeight': '100vh'
})

if __name__ == '__main__':
    app.run(debug=True)
